import { animate, onScroll, splitText, stagger, svg, utils } from 'animejs';
import { EASE_OUT, reduceMotion, revealOnce, revealTitle } from './motion.js';

export function initScroll() {
  document.querySelectorAll('.split-title').forEach(revealTitle);
  initMarquee();
  if (reduceMotion) return;

  heroExit();
  statement();
  lineup();
  repairRows();
  footerWord();
}

/** Hero dissolves as you scroll: copy lifts away, photos drift at their own depths. */
function heroExit() {
  const sync = () => onScroll({ target: '.hero', enter: 'top top', leave: 'top bottom', sync: 0.25 });
  animate('.hero-copy', { y: [0, -140], opacity: [1, 0], ease: 'linear', autoplay: sync() });
  animate('.float', {
    y: (el) => -parseFloat(el.dataset.depth) * 320,
    scale: (el) => 1 + parseFloat(el.dataset.depth) * 0.12,
    ease: 'linear',
    autoplay: sync(),
  });
  animate('.hero-orbits', { scale: [1, 1.35], opacity: [1, 0], ease: 'linear', autoplay: sync() });
}

/** Endless brand ribbon that speeds up with scroll velocity, then settles. */
function initMarquee() {
  const track = document.querySelector('.marquee-track');
  if (reduceMotion) return;
  const loop = animate(track, { x: ['0%', '-50%'], duration: 28000, ease: 'linear', loop: true });
  let lastY = scrollY;
  let boost = 0;
  addEventListener('scroll', () => {
    boost = Math.min(Math.abs(scrollY - lastY) * 0.35, 9);
    lastY = scrollY;
  }, { passive: true });
  (function tick() {
    boost *= 0.92;
    loop.speed = 1 + boost;
    requestAnimationFrame(tick);
  })();
}

/** Words light up one by one as the paragraph passes; the years counter and ring draw in. */
function statement() {
  const words = splitText('.statement-text', { words: true }).words;
  animate(words, {
    opacity: [0.14, 1],
    delay: stagger(40),
    ease: 'linear',
    autoplay: onScroll({ target: '.statement-text', enter: '90% top', leave: '45% bottom', sync: 0.4 }),
  });

  const num = document.querySelector('.years-num');
  const counter = { v: 0 };
  const ring = svg.createDrawable('.years-ring circle');
  utils.set(ring, { draw: '0 0' });
  revealOnce('.statement', counter, {
    v: 5, duration: 2200, ease: EASE_OUT,
    onUpdate: () => { num.textContent = Math.round(counter.v); },
  });
  revealOnce('.statement', ring, { draw: ['0 0', '0 1'], duration: 2400, ease: 'inOut(3)' });
}

/** Pinned section: vertical scroll drives the photo track sideways. */
function lineup() {
  const track = document.querySelector('.lineup-track');
  const distance = () => -(track.scrollWidth - innerWidth);
  const sync = () => onScroll({ target: '.lineup', enter: 'top top', leave: 'bottom bottom', sync: 0.12 });

  const move = animate(track, { x: distance, ease: 'linear', autoplay: sync() });
  animate('.lineup-progress i', { scaleX: [0, 1], ease: 'linear', autoplay: sync() });

  // Each photo pans inside its frame, opposite to the track — a subtle parallax window.
  utils.set('.panel-img img', { scale: 1.18 });
  animate('.panel-img img', { x: ['7%', '-7%'], ease: 'linear', autoplay: sync() });

  // Captions slide up as their panel enters.
  document.querySelectorAll('.panel figcaption').forEach((cap) => utils.set(cap, { opacity: 0, y: 20 }));
  animate('.panel figcaption', {
    opacity: [0, 1], y: [20, 0], delay: stagger(120), ease: 'linear',
    autoplay: onScroll({ target: '.lineup', enter: 'top top', leave: '60% bottom', sync: 0.2 }),
  });

  addEventListener('resize', () => move.refresh());
}

/** Repair rows stagger in; hovering a row fills it and redraws its icon. */
function repairRows() {
  const rows = document.querySelectorAll('.repair-row');
  utils.set(rows, { opacity: 0, y: 40 });
  revealOnce('.repair-list', rows, { opacity: [0, 1], y: [40, 0], duration: 1100, delay: stagger(90), ease: EASE_OUT });

  rows.forEach((row) => {
    const fill = row.querySelector('.fill');
    const icon = svg.createDrawable(row.querySelectorAll('.r-icon path'), 0, 1);
    const arrow = row.querySelector('.repair-arrow svg');
    row.addEventListener('pointerenter', () => {
      animate(fill, { scaleY: [0, 1], duration: 700, ease: 'out(4)', composition: 'replace' });
      animate(icon, { draw: ['0 0', '0 1'], duration: 900, ease: 'inOut(3)' });
      animate(arrow, { x: [{ to: 24, duration: 250, ease: 'in(3)' }, { to: -24, duration: 0 }, { to: 0, duration: 500, ease: EASE_OUT }] });
    });
    row.addEventListener('pointerleave', () => {
      utils.set(fill, { transformOrigin: '50% 0%' });
      animate(fill, {
        scaleY: 0, duration: 600, ease: 'inOut(3)', composition: 'replace',
        onComplete: () => utils.set(fill, { transformOrigin: '50% 100%' }),
      });
    });
  });
}

/** Giant wordmark: letters rise on enter, each one springs when touched. */
function footerWord() {
  const word = document.querySelector('.footer-word');
  const chars = splitText(word, { chars: { class: 'char-hit' } }).chars;
  utils.set(chars, { y: '60%', opacity: 0 });
  revealOnce(word, chars, { y: ['60%', '0%'], opacity: [0, 1], duration: 1600, delay: stagger(90), ease: 'out(5)' });
  chars.forEach((c) => {
    c.addEventListener('pointerenter', () => {
      animate(c, {
        y: [{ to: '-14%', duration: 260, ease: 'out(3)' }, { to: '0%', duration: 1100, ease: 'outElastic(1, .3)' }],
        color: [{ to: '#c8ff3d', duration: 200 }, { to: '#ffffff', duration: 1400 }],
      });
    });
  });
}
