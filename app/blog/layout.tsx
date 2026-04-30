import "./blog.css";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <div className="blog-root">{children}</div>;
}
