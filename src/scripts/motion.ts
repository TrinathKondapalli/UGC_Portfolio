import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = () => window.matchMedia('(hover: none)').matches;

export function initMotion() {
  heroSequence();
  if (prefersReducedMotion()) return;
  fanPointerTilt();
  stepLineScrub();
  aanyaReveal();
  magneticCta();
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

function stepLineScrub() {
  const track = document.getElementById('steps-track');
  const fill = document.getElementById('steps-line-fill');
  const numbers = gsap.utils.toArray<HTMLElement>('[data-step-number]');
  if (!track || !fill) return;

  const isDesktop = window.matchMedia('(min-width: 900px)').matches;
  gsap.set(fill, isDesktop ? { scaleX: 0 } : { scaleY: 0 });
  gsap.set(numbers, { color: '#8C8C8C' });

  ScrollTrigger.create({
    trigger: track,
    start: 'top 75%',
    end: 'bottom 60%',
    scrub: 0.4,
    onUpdate: (self) => {
      gsap.set(fill, isDesktop ? { scaleX: self.progress } : { scaleY: self.progress });
      numbers.forEach((num, i) => {
        const threshold = i / (numbers.length - 1);
        gsap.set(num, { color: self.progress >= threshold ? '#F4A51C' : '#8C8C8C' });
      });
    },
  });
}

function aanyaReveal() {
  const portrait = document.getElementById('aanya-portrait');
  if (!portrait) return;

  gsap.set(portrait, { filter: 'blur(6px)' });
  ScrollTrigger.create({
    trigger: portrait,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(portrait, {
        filter: 'blur(0px)',
        duration: 0.7,
        ease: 'power2.out',
      });
    },
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
