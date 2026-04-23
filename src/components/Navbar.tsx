// Legacy <Navbar /> shim. The site-wide nav is now provided once at the App
// level by `src/components/layout/Nav.tsx`. This component is intentionally a
// no-op so existing pages that still import `<Navbar />` keep compiling without
// rendering a duplicate header.
export default function Navbar() {
  return null
}
