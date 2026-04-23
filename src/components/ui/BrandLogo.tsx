import { useState } from 'react';

type Props = {
  /** Direct URL override (e.g. an svgporn or self-hosted SVG). Used first if provided. */
  src?: string;
  /** Simple Icons slug (https://simpleicons.org). e.g. "postgresql", "kubernetes" */
  slug?: string;
  /** Fallback domain for a favicon if both `src` and `slug` 404 */
  domain?: string;
  /** Force a hex tint via the Simple Icons CDN (no leading "#"). e.g. "ffffff" */
  tint?: string;
  alt: string;
  className?: string;
};

export const simpleIconsUrl = (slug: string, tint?: string) =>
  tint
    ? `https://cdn.simpleicons.org/${slug}/${tint}`
    : `https://cdn.simpleicons.org/${slug}`;

export const svgPornUrl = (slug: string) =>
  `https://cdn.svgporn.com/logos/${slug}.svg`;

export const faviconUrl = (domain: string) =>
  `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

function pickInitial({ src, slug, domain, tint }: Props): string {
  if (src) return src;
  if (slug) return simpleIconsUrl(slug, tint);
  if (domain) return faviconUrl(domain);
  return '';
}

export default function BrandLogo(props: Props) {
  const { domain, alt, className } = props;
  const [src, setSrc] = useState(() => pickInitial(props));
  const [errored, setErrored] = useState(false);

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (errored || !domain) return;
        const fallback = faviconUrl(domain);
        if (src !== fallback) {
          setSrc(fallback);
          setErrored(true);
        }
      }}
    />
  );
}
