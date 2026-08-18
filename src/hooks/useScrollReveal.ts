import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Attach IntersectionObserver to `.reveal` elements not yet marked `.visible`. */
export function attachScrollReveal(): IntersectionObserver | undefined {
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.visible)');
  if (els.length === 0) return undefined;

  if (!('IntersectionObserver' in window)) {
    els.forEach((e) => e.classList.add('visible'));
    return undefined;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
  );
  els.forEach((e) => io.observe(e));
  return io;
}

export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    let io: IntersectionObserver | undefined;
    let cancelled = false;

    const attach = () => {
      if (cancelled) return;
      io?.disconnect();
      io = attachScrollReveal();
    };

    /* First paint + two follow-ups: product pages mount heavy sections
       after the initial rAF, so a single pass can miss `.reveal` nodes and
       leave them at opacity: 0 forever. */
    const raf = requestAnimationFrame(attach);
    const t1 = window.setTimeout(attach, 50);
    const t2 = window.setTimeout(attach, 300);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      io?.disconnect();
    };
  }, [pathname]);
}
