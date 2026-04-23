import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useScrollReveal() {
  const { pathname } = useLocation();

  useEffect(() => {
    const attach = () => {
      const els = document.querySelectorAll<HTMLElement>('.reveal:not(.visible)');
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
    };

    // Defer to next frame so DOM for the new route has mounted.
    let io: IntersectionObserver | undefined;
    const raf = requestAnimationFrame(() => {
      io = attach();
    });
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, [pathname]);
}
