import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = () => window.matchMedia('(hover: none)').matches;

export function initMotion() {
  if (!prefersReducedMotion()) {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  initCursor();

  const preloader = document.getElementById('preloader');

  if (prefersReducedMotion()) {
    if (preloader) preloader.style.display = 'none';
    heroSequence();
    return;
  }

  const runScrollAnimations = () => {
    heroScrollParallax();
    workRailPinning();
    fanPointerTilt();
    stackingCardsEffect();
    nicheWipes();
    aanyaReveal();
    magneticCta();
  };

  if (preloader) {
    preloaderSequence(() => {
      heroSequence();
      runScrollAnimations();
    });
  } else {
    heroSequence();
    runScrollAnimations();
  }
}

function preloaderSequence(onComplete: () => void) {
  const preloader = document.getElementById('preloader');
  const counter = document.getElementById('preloader-counter');
  const bar = document.getElementById('preloader-bar-fill');
  const brand = preloader?.querySelector('.preloader-brand');
  
  if (!preloader || !counter || !bar || !brand) return onComplete();

  document.body.style.overflow = 'hidden';
  window.scrollTo(0, 0);

  const tl = gsap.timeline({
    onComplete: () => {
      document.body.style.overflow = '';
      gsap.set(preloader, { display: 'none' });
      onComplete();
    },
  });

  tl.to(brand, {
    yPercent: 0,
    duration: 1,
    ease: 'power3.out',
  });

  const progress = { val: 0 };
  tl.to(progress, {
    val: 100,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      counter.innerText = Math.round(progress.val) + '%';
    },
  }, "<0.2");

  tl.to(bar, {
    scaleX: 1,
    duration: 2,
    ease: 'power2.inOut',
  }, "<");

  tl.to(preloader, {
    yPercent: -100,
    duration: 0.9,
    ease: 'power4.inOut',
  }, "+=0.3");
}

function heroSequence() {
  const lines = gsap.utils.toArray<HTMLElement>('.hero-line');
  const phones = gsap.utils.toArray<HTMLElement>('[data-phone]');
  const centerVideo = document.querySelector<HTMLVideoElement>(
    '.phone-1 video[data-hero-video]'
  );

  if (prefersReducedMotion()) {
    centerVideo?.play().catch(() => {});
    return;
  }

  gsap.set(lines, { yPercent: 110 });
  phones.forEach((phone) => {
    const baseScale = Number(phone.dataset.baseScale ?? 1);
    gsap.set(phone, { autoAlpha: 0, y: 40, scale: baseScale * 0.88 });
  });

  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
  tl.to(lines, {
    yPercent: 0,
    duration: 0.7,
    stagger: 0.08,
  });
  phones.forEach((phone, i) => {
    const baseScale = Number(phone.dataset.baseScale ?? 1);
    tl.to(
      phone,
      {
        autoAlpha: 1,
        y: 0,
        scale: baseScale,
        duration: 0.5,
        onComplete: i === phones.length - 1 ? () => centerVideo?.play().catch(() => {}) : undefined,
      },
      `-=${i === 0 ? 0.25 : 0.4}`
    );
  });
}

function fanPointerTilt() {
  if (isTouch()) return;
  const fan = document.getElementById('hero-fan');
  if (!fan) return;

  const rotate = gsap.quickTo(fan, 'rotateY', { duration: 0.18, ease: 'power2.out' });
  const rotateX = gsap.quickTo(fan, 'rotateX', { duration: 0.18, ease: 'power2.out' });

  gsap.set(fan, { transformPerspective: 800 });

  fan.addEventListener('mousemove', (e) => {
    const rect = fan.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotate(px * 8);
    rotateX(-py * 8);
  });
  fan.addEventListener('mouseleave', () => {
    rotate(0);
    rotateX(0);
  });
}

function stackingCardsEffect() {
  const cards = gsap.utils.toArray<HTMLElement>('.step-card');
  if (cards.length === 0) return;

  cards.forEach((card, i) => {
    if (i === cards.length - 1) return;
    const inner = card.querySelector('.step-card-inner');
    if (!inner) return;
    
    gsap.to(inner, {
      scale: 0.95 - (cards.length - i) * 0.01,
      opacity: 0.4,
      scrollTrigger: {
        trigger: cards[i + 1],
        start: 'top bottom',
        end: 'top top',
        scrub: true,
      }
    });
  });
}

function aanyaReveal() {
  const portrait = document.getElementById('aanya-portrait');
  const displacement = document.getElementById('displacement');
  if (!portrait || !displacement) return;

  gsap.set(portrait, { filter: 'url(#liquid)', opacity: 0 });
  gsap.set(displacement, { attr: { scale: 100 } });

  ScrollTrigger.create({
    trigger: portrait,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      const tl = gsap.timeline();
      tl.to(portrait, { opacity: 1, duration: 0.8, ease: 'power2.out' });
      tl.to(displacement, { attr: { scale: 0 }, duration: 2, ease: 'power4.out' }, "<");
    },
  });

  portrait.parentElement?.addEventListener('mouseenter', () => {
    gsap.to(displacement, { attr: { scale: 20 }, duration: 0.5, ease: 'power2.out' });
  });
  portrait.parentElement?.addEventListener('mouseleave', () => {
    gsap.to(displacement, { attr: { scale: 0 }, duration: 1, ease: 'power4.out' });
  });
}

function magneticCta() {
  if (isTouch()) return;
  const cta = document.getElementById('closing-cta');
  if (!cta) return;

  const moveX = gsap.quickTo(cta, 'x', { duration: 0.18, ease: 'power2.out' });
  const moveY = gsap.quickTo(cta, 'y', { duration: 0.18, ease: 'power2.out' });
  const radius = 80;

  window.addEventListener('mousemove', (e) => {
    const rect = cta.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < radius) {
      const pull = (1 - dist / radius) * 6;
      moveX((dx / dist || 0) * pull);
      moveY((dy / dist || 0) * pull);
    } else {
      moveX(0);
      moveY(0);
    }
  });
}

function initCursor() {
  if (isTouch()) return;
  const cursor = document.getElementById('custom-cursor');
  if (!cursor) return;
  
  const moveCursor = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' });
  const moveCursorY = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' });
  
  window.addEventListener('mousemove', (e) => {
    moveCursor(e.clientX);
    moveCursorY(e.clientY);
  });
  
  const interactiveElements = document.querySelectorAll('a, button, [tabindex="0"]');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

function heroScrollParallax() {
  const hero = document.getElementById('hero');
  const phones = gsap.utils.toArray<HTMLElement>('[data-phone]');
  if (!hero || phones.length === 0) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    }
  });

  tl.to(phones[0], { yPercent: -40, rotate: -15, scale: 0.95 }, 0);
  tl.to(phones[1], { yPercent: -60, scale: 1.1 }, 0);
  tl.to(phones[2], { yPercent: -30, rotate: 15, scale: 1 }, 0);
  
  const text = hero.querySelector('.hero-copy');
  if (text) {
    tl.to(text, { yPercent: -20, opacity: 0 }, 0);
  }
}

function workRailPinning() {
  if (isTouch()) return;
  const section = document.getElementById('work');
  const rail = document.getElementById('work-rail');
  if (!section || !rail) return;

  const getScrollAmount = () => {
    const railWidth = rail.scrollWidth;
    return -(railWidth - window.innerWidth + 40);
  };

  gsap.to(rail, {
    x: getScrollAmount,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: () => `+=${rail.scrollWidth}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
    }
  });
}

function nicheWipes() {
  const container = document.getElementById('niches-pin-container');
  const panels = gsap.utils.toArray<HTMLElement>('.niche-wipe-panel');
  if (!container || panels.length < 2) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      pin: true,
      scrub: 1,
      start: 'top top',
      end: () => "+=" + (panels.length * window.innerHeight),
      invalidateOnRefresh: true,
    }
  });

  panels.forEach((panel, i) => {
    if (i === 0) return;
    tl.fromTo(panel, 
      { yPercent: 100 },
      { yPercent: 0, ease: 'none' }
    );
  });
}
