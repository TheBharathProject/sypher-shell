/**
 * sypher-shell — app/api/stripe/webhook/route.ts
 *
 * Source of truth for subscription state. Stripe events drive the
 * subscriptions table. Idempotent: replaying any event must be safe.
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  if (!sig) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('webhook signature verification failed', err);
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        // Stripe Checkout for a subscription completes when the subscription is created.
        // We rely on customer.subscription.created for the actual state, but we use this
        // event to capture the user_id <-> stripe_customer_id mapping on first purchase.
        const userId = session.metadata?.user_id;
        const customerId = session.customer as string | null;
        if (userId && customerId) {
          await supabaseAdmin
            .from('profiles')
            .update({ stripe_customer_id: customerId })
            .eq('id', userId);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        const toolSlug = sub.metadata?.tool_slug;
        if (!userId || !toolSlug) {
          console.error('subscription missing metadata', sub.id);
          return NextResponse.json({ received: true }); // ack, no action
        }

        const priceId = sub.items.data[0]?.price.id;

        await supabaseAdmin.from('subscriptions').upsert(
          {
            user_id: userId,
            tool_slug: toolSlug,
            status: sub.status,
            stripe_subscription_id: sub.id,
            stripe_price_id: priceId,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            cancel_at_period_end: sub.cancel_at_period_end,
          },
          { onConflict: 'user_id,tool_slug' },
        );

        await supabaseAdmin.from('audit_log').insert({
          user_id: userId,
          actor: 'system',
          event: `subscription.${event.type.split('.').pop()}`,
          payload: { stripe_subscription_id: sub.id, tool_slug: toolSlug, status: sub.status },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled', cancel_at_period_end: false })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'past_due' })
            .eq('stripe_subscription_id', invoice.subscription as string);
        }
        break;
      }

      default:
        // Unhandled event — fine, just ack.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('webhook handler failed', err);
    // Return 500 so Stripe retries.
    return NextResponse.json({ error: 'handler error' }, { status: 500 });
  }
}

// Stripe needs the raw body for signature verification — disable Next's body parsing.
export const config = {
  api: { bodyParser: false },
};
