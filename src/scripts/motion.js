import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// One orchestrated intro on the home hero.
// Everything is skipped under prefers-reduced-motion; the page is fully usable without it.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduced) {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({ lerp: 0.12 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    gsap
      .timeline({ defaults: { ease: 'power3.out' } })
      .from('[data-hero-seam]', { scaleY: 0, transformOrigin: 'top', duration: 0.9 })
      .from('[data-hero-name="sg"]', { xPercent: -8, autoAlpha: 0, duration: 1 }, '-=0.5')
      .from('[data-hero-name="vn"]', { xPercent: 8, autoAlpha: 0, duration: 1 }, '<')
      .from('[data-hero-line]', { y: 16, autoAlpha: 0, duration: 0.7 }, '-=0.4');
  }
}
