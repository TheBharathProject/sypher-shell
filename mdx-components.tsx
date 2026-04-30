import type { MDXComponents } from "mdx/types";

// Required by @next/mdx for App Router. Returning an empty object means
// MDX uses default HTML elements; the `.post-prose` CSS in app/blog/blog.css
// styles them.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...components };
}
