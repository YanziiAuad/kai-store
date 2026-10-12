import { animate, createAnimatable } from 'animejs';
import { finePointer, reduceMotion } from './motion.js';

// Two-part cursor: a precise dot and a ring that trails with inertia.
// Hovering anything with [data-cursor] grows the ring and shows a label.
export function initCursor() {
  if (!finePointer || reduceMotion) return;
  document.body.classList.add('has-cursor');

  const root = document.querySelector('.cursor');
  const ringEl = root.querySelector('.cursor-ring');
  const label = root.querySelector('.cursor-label');
  const dot = createAnimatable('.cursor-dot', { x: 90, y: 90, ease: 'out(3)' });
  const ring = createAnimatable(ringEl, { x: 550, y: 550, ease: 'out(4)' });

  addEventListener('pointermove', (e) => {
    dot.x(e.clientX); dot.y(e.clientY);
    ring.x(e.clientX); ring.y(e.clientY);
  }, { passive: true });

  document.addEventListener('pointerleave', () => animate(root, { opacity: 0, duration: 300 }));
  document.addEventListener('pointerenter', () => animate(root, { opacity: 1, duration: 300 }));

  const grow = (size, text) => {
    label.textContent = text || '';
    root.classList.toggle('is-label', Boolean(text));
    animate(ringEl, {
      width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
      duration: 650, ease: 'out(4)',
    });
    animate(label, { opacity: text ? 1 : 0, scale: text ? [0.6, 1] : 1, duration: 450, ease: 'out(3)' });
  };

  let current = null;
  document.addEventListener('pointerover', (e) => {
    const t = e.target.closest('[data-cursor], a, button, label, input, textarea');
    if (t === current) return;
    current = t;
    if (!t) return grow(40);
    if (t.matches('input, textarea')) return grow(12);
    if (t.dataset.cursor) return grow(92, t.dataset.cursor);
    grow(64);
  });

  addEventListener('pointerdown', () => animate(ringEl, { scale: 0.8, duration: 200, ease: 'out(3)' }));
  addEventListener('pointerup', () => animate(ringEl, { scale: 1, duration: 700, ease: 'outElastic(1, .5)' }));
}
