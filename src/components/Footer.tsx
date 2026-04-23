// Legacy <Footer /> shim. The site-wide footer is now provided once at the App
// level by `src/components/layout/Footer.tsx`. This component is intentionally
// a no-op so existing pages that still import `<Footer />` keep compiling
// without rendering a duplicate footer.
export default function Footer() {
  return null
}
