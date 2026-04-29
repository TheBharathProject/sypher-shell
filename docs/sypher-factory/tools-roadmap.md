# Tools Roadmap

Living queue of tool ideas for the factory. Status values: `idea` → `validated` → `planned` → `building` → `beta` → `live` → `sunset`.

When picking the next tool to build, prefer:
- **High organic search volume** for the primary keyword
- **Cheap unit economics** (≤ ₹2/use variable cost) for ₹99 tier candidates
- **Adjacent value to existing tools** (cross-sell within the factory)
- **Pipeline reuse** (if it shares infrastructure with already-shipped tools)

## Tool 1 — Reel Hooks

```yaml
slug: reel-hooks
status: planned
one-liner: Decode any creator's top reels.
primary-keyword: instagram reel transcription
audience: Indian creators, social media managers, content marketers
price-tier: ₹99/month (Starter), ₹499/month (Pro)
variable-cost: ~₹26/user/month (40 fresh reels at ₹0.65 each, before caching)
pipeline:
  - Apify Instagram scraper → top 10 reels per profile
  - yt-dlp → audio extraction
  - Deepgram Nova-2 → transcription
  - Anthropic Claude Haiku 4.5 → hook archetype + repurpose
key-features:
  - 2 profiles tracked (Starter)
  - Top 10 reels per profile, weekly auto-refresh
  - Transcript + hook breakdown + "repurpose for my niche"
  - Free tier: 1 profile, top 5 reels, monthly refresh
seo-targets:
  - "instagram reel transcription"
  - "instagram hook analyzer"
  - "instagram content research tool"
  - "creator content competitive analysis"
risk-and-mitigation:
  - IG ToS (Apify violates IG ToS, not yours): keep acquisition layer abstracted; have a backup scraper provider
  - Apify rate-limit per user (avoid scraping 5M-follower account 10x/day)
  - Cache hits depend on niche concentration; market to specific niches first
```

## Tool 2 — YouTube Shorts/Long-form Summarizer (concept)

```yaml
slug: yt-summarizer
status: idea
one-liner: TL;DR any YouTube video in 60 seconds.
primary-keyword: youtube video summarizer
price-tier: ₹99/month
variable-cost: ~₹3-5/use (longer transcription)
pipeline:
  - YouTube transcript API (free, when available) OR yt-dlp + Deepgram
  - Anthropic Claude Sonnet 4.6 for structured summary (longer context)
key-features:
  - Paste URL → 60-sec summary, key points, timestamps
  - Save library, search across past summaries
  - Free: 5/month; Starter: 100/month; Pro: unlimited
notes:
  - Crowded space (many free competitors); differentiator must be quality + library + integration with other Sypher tools
  - Could pair with Reel Hooks: "summarize this YouTube video and turn it into 3 reel scripts"
```

## Tool 3 — Hook Generator (concept)

```yaml
slug: hook-generator
status: idea
one-liner: Generate 20 viral hooks for any topic in your voice.
primary-keyword: viral hook generator
price-tier: ₹99/month
variable-cost: ~₹0.30/generation (LLM only, no scraping)
pipeline:
  - User inputs topic + voice samples
  - Anthropic Claude Sonnet generates hooks tagged by archetype
key-features:
  - Trains on user's past content for "in my voice" generation
  - Free: 5 hooks/day; Starter: 100/month; Pro: unlimited
notes:
  - Cheapest pipeline of any tool. Heavy free tier viable.
  - Strong cross-sell from Reel Hooks ("turn these competitor hooks into yours")
```

## Tool 4 — Hashtag Research (concept)

```yaml
slug: hashtag-research
status: idea
one-liner: Find the hashtags actually moving the needle in your niche.
primary-keyword: instagram hashtag research
price-tier: ₹99/month
variable-cost: ~₹1-2/search
notes: Likely shared scraping infrastructure with Reel Hooks.
```

## Tool 5 — Thumbnail A/B Grader (concept)

```yaml
slug: thumbnail-grader
status: idea
one-liner: Score your thumbnail before you post.
primary-keyword: youtube thumbnail analyzer
price-tier: ₹299/month (Pro tier — vision is expensive)
variable-cost: ~₹3-5/grade
pipeline: Vision LLM (Claude Sonnet) for analysis
notes: Vision pipeline = doesn't fit ₹99 tier. Pro-only.
```

## Tool ideas backlog (to validate)

- Caption rewriter (boring → punchy)
- Audio remix detector ("this trending sound is being used by X creators in your niche")
- Comment sentiment + question extraction (turn fan questions into content ideas)
- Reel-to-shorts converter (vertical to horizontal aware crop suggestions)
- Brand voice extractor (give it your past 50 posts, get a style guide)
- Comparison tool ("vs. competitor: who posts more, when, what hooks")
- Newsletter / blog post generator (turn a reel transcript into long-form)
- Trend alert (subscribe to a niche, get pinged when a hook archetype is spiking)

## What goes in this file vs. GitHub issues

This file: ideas, validation notes, tool-level scope.
GitHub issues: bugs and features within an already-shipped tool.

When a tool moves from `planned` → `building`, create a GitHub Project + first issues for it.

## Validation steps before promoting `idea` → `planned`

1. Search the primary keyword on Google. Are the top 10 results brand-name competitors with deep moats? If yes, pick a more specific keyword or skip.
2. Check Ahrefs/Ubersuggest free tier for keyword volume. < 100 searches/month → skip unless you can hit a long-tail cluster.
3. Is the variable cost compatible with the desired price tier? (See `pricing-economics.md` rule of thumb.)
4. Can the pipeline be implemented in <5 days for tool #1, <2 days for tool #5+? If not, scope down or skip.
5. Does it cross-sell with at least one already-shipped Sypher tool? (Not required for first tool, important for tools 3+.)

If 4 of 5 pass, promote to `planned`.
