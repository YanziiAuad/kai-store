import { animate, createAnimatable, onScroll, splitText, stagger, utils } from 'animejs';

export const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Premium-feeling defaults: long, decelerating curves.
export const EASE_OUT = 'out(4)';
export const EASE_IN_OUT = 'inOut(4)';

/** Split a heading into chars, each word clipped so chars rise from beneath a mask. */
export function splitChars(el) {
  return splitText(el, { words: { wrap: 'clip' }, chars: true }).chars;
}

/** Play `params` on `targets` once, when `trigger` scrolls 85% up the viewport. */
export function revealOnce(trigger, targets, params) {
  if (reduceMotion) return;
  return animate(targets, {
    ...params,
    autoplay: onScroll({ target: trigger, enter: '85% top', sync: 'play', repeat: false }),
  });
}

/** Staggered mask reveal for big section titles. */
export function revealTitle(el) {
  const chars = splitChars(el);
  if (reduceMotion) return;
  utils.set(chars, { y: '110%' });
  revealOnce(el, chars, {
    y: ['110%', '0%'],
    rotate: [8, 0],
    duration: 1300,
    delay: stagger(22),
    ease: EASE_OUT,
  });
}

/** Elements drift toward the cursor, then spring home on leave. */
export function magnetize(root = document) {
  if (!finePointer || reduceMotion) return;
  root.querySelectorAll('.magnetic').forEach((el) => {
    if (el.dataset.magnet) return;
    el.dataset.magnet = '1';
    const strength = parseFloat(el.dataset.strength || '0.32');
    const pull = createAnimatable(el, { x: 600, y: 600, ease: 'out(3)' });
    let rect;
    el.addEventListener('pointerenter', () => { rect = el.getBoundingClientRect(); });
    el.addEventListener('pointermove', (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      pull.x((e.clientX - (rect.left + rect.width / 2)) * strength);
      pull.y((e.clientY - (rect.top + rect.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      rect = null;
      pull.x(0, 1100, 'outElastic(1, .45)');
      pull.y(0, 1100, 'outElastic(1, .45)');
    });
  });
}

/** Character "roll" on hover for nav links. */
export function rollLinks() {
  document.querySelectorAll('.roll span').forEach((span) => {
    const chars = splitText(span, { chars: { wrap: 'clip' } }).chars;
    if (reduceMotion) return;
    let busy = false;
    span.closest('a').addEventListener('pointerenter', () => {
      if (busy) return;
      busy = true;
      animate(chars, {
        y: [
          { to: '-110%', duration: 280, ease: 'in(3)' },
          { to: '110%', duration: 0 },
          { to: '0%', duration: 520, ease: EASE_OUT },
        ],
        delay: stagger(24),
        onComplete: () => { busy = false; },
      });
    });
  });
}
