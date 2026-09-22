import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Easing family
export const ease = {
  reveal: 'expo.out',
  scrub: 'power2.inOut',
  enter: 'expo.out',
};

// Duration steps
export const dur = {
  fast: 0.6,
  mid: 0.9,
  slow: 1.4,
};

// Stagger
export const stagger = {
  lines: 0.08,
  cards: 0.06,
};

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export async function initScroll() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const { default: Lenis } = await import('lenis');
  lenisInstance = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenisInstance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Smooth anchor links
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('site-header')?.offsetHeight ?? 80;
      lenisInstance.scrollTo(target, { offset: -headerH });
    });
  });
}

// Text reveal: H1 / H2 lines slide up from a clip-mask
export function revealLines(el, delay = 0) {
  if (!el) return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lines = el.querySelectorAll('.line');
  if (!lines.length) return;
  if (prefersReduced) return;

  gsap.fromTo(
    lines,
    { yPercent: 110, opacity: 0 },
    {
      yPercent: 0,
      opacity: 1,
      duration: dur.slow,
      ease: ease.reveal,
      stagger: stagger.lines,
      delay,
    }
  );
}

// Glow-reveal for images (Phase 2 – called from image observer)
export function glowReveal(container, img, delay = 0) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    gsap.set(container, { clipPath: 'inset(0 0 0 0)' });
    gsap.set(img, { scale: 1, filter: 'saturate(1) brightness(1)' });
    return;
  }

  const tl = gsap.timeline({ delay });
  tl.fromTo(
    container,
    { clipPath: 'inset(100% 0 0 0)' },
    { clipPath: 'inset(0% 0 0 0)', duration: dur.slow, ease: ease.reveal }
  )
    .fromTo(img, { scale: 1.18 }, { scale: 1, duration: dur.slow, ease: ease.reveal }, '<')
    .fromTo(
      img,
      { filter: 'saturate(0.3) brightness(0.75)' },
      { filter: 'saturate(1) brightness(1)', duration: dur.mid, ease: 'power2.out' },
      '<0.2'
    );
}
