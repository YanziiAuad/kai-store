import { animate, createAnimatable, createTimeline, stagger, svg, utils } from 'animejs';
import { EASE_OUT, finePointer, reduceMotion, splitChars } from './motion.js';

// Each floating photo's resting tilt, in degrees.
const TILT = { f1: -6, f2: 8, f3: 14, f4: -10 };

/**
 * Loader → hero, as one master timeline:
 * phone outline draws, counter runs, wordmark rises, the curtain lifts,
 * then the photos fly in, the orbits draw and the headline staggers up.
 */
export function playIntro(onHeroReady) {
  const loader = document.querySelector('.loader');
  const floats = [...document.querySelectorAll('.float')];
  const titleChars = splitChars(document.querySelector('.hero-title'));

  floats.forEach((f) => utils.set(f, { rotate: TILT[f.classList[1]] || 0 }));

  if (reduceMotion) {
    loader.remove();
    document.body.classList.remove('is-loading');
    onHeroReady();
    return;
  }

  const heroBits = ['.hero-eyebrow', '.hero-sub', '.hero-ctas > *', '.scroll-cue'];
  utils.set(titleChars, { y: '110%' });
  utils.set(heroBits.join(','), { opacity: 0, y: 24 });
  utils.set('.header', { opacity: 0, y: -16 });
  utils.set(floats, { opacity: 0, y: 260, scale: 0.86 });
  floats.forEach((f) => utils.set(f, { rotate: (TILT[f.classList[1]] || 0) + 18 }));
  utils.set('.orbit-dot', { opacity: 0 });

  const count = loader.querySelector('.loader-count');
  const counter = { v: 0 };
  const orbits = svg.createDrawable('#orbit-a');
  utils.set(orbits, { draw: '0 0' });
  utils.set('#orbit-b', { opacity: 0 });

  const tl = createTimeline({ defaults: { ease: 'inOut(3)' } });

  tl
    // ── Loader
    .add(svg.createDrawable('.loader-phone rect, .loader-phone path'), {
      draw: ['0 0', '0 1'], duration: 1700, delay: stagger(160),
    }, 0)
    .add(counter, {
      v: 100, duration: 2100, ease: 'inOut(2)',
      onUpdate: () => { count.textContent = String(Math.round(counter.v)).padStart(3, '0'); },
    }, 0)
    .add('.loader-text', { y: ['120%', '0%'], duration: 1000, ease: EASE_OUT }, 650)
    .add('.loader-phone', { scale: [1, 1.06], duration: 1500 }, 500)
    .add('.loader-text', { y: '-120%', duration: 550, ease: 'in(3)' }, 2250)
    .add('.loader-phone', { scale: 7, opacity: 0, duration: 1000, ease: 'in(4)' }, 2250)
    .add(loader, {
      clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'],
      duration: 1100, ease: 'inOut(4)',
      onComplete: () => { loader.remove(); document.body.classList.remove('is-loading'); },
    }, 2700)

    // ── Hero
    .add(orbits, { draw: ['0 0', '0 1'], duration: 2200, ease: 'inOut(3)' }, 3000)
    .add('#orbit-b', { opacity: [0, 1], scale: [0.85, 1], duration: 2200, ease: EASE_OUT }, 3300)
    .add(floats, {
      opacity: [0, 1],
      y: [260, 0],
      scale: [0.86, 1],
      rotate: (el) => TILT[el.classList[1]] || 0,
      duration: 1900, ease: 'out(5)', delay: stagger(110, { from: 'last' }),
    }, 3050)
    .add(titleChars, {
      y: ['110%', '0%'], rotate: [10, 0],
      duration: 1400, ease: EASE_OUT, delay: stagger(26),
    }, 3250)
    .add(heroBits.join(','), {
      opacity: [0, 1], y: [24, 0], duration: 1100, ease: EASE_OUT, delay: stagger(90),
    }, 3800)
    .add('.header', { opacity: [0, 1], y: [-16, 0], duration: 1000, ease: EASE_OUT }, 3900)
    .add('.orbit-dot', { opacity: [0, 1], duration: 600 }, 4300)
    .call(onHeroReady, 4600);
}

/** Always-on ambience once the hero is in: idle float, orbit dot, mouse parallax. */
export function heroAmbient() {
  if (reduceMotion) return;

  // Idle bob — each photo on its own rhythm so the group never syncs up.
  document.querySelectorAll('.float img').forEach((img, i) => {
    animate(img, {
      y: [0, -16 - i * 4],
      rotate: [0, i % 2 ? 2 : -2],
      duration: 3200 + i * 700,
      ease: 'inOut(2)',
      alternate: true,
      loop: true,
    });
  });

  // Accent dot riding the orbit path.
  const path = svg.createMotionPath('#orbit-a');
  animate('.orbit-dot', { ...path, duration: 16000, ease: 'linear', loop: true });

  // Mouse parallax: deeper photos travel further, giving the stage real depth.
  if (!finePointer) return;
  const layers = [...document.querySelectorAll('.float')].map((f) => ({
    depth: parseFloat(f.dataset.depth || '1'),
    anim: createAnimatable(f.querySelector('.float-in'), { x: 1400, y: 1400, rotate: 1400, ease: 'out(3)' }),
  }));
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', (e) => {
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    layers.forEach(({ depth, anim }) => {
      anim.x(nx * 60 * depth);
      anim.y(ny * 40 * depth);
      anim.rotate(nx * 6 * depth);
    });
  });
  hero.addEventListener('pointerleave', () => {
    layers.forEach(({ anim }) => { anim.x(0, 1600); anim.y(0, 1600); anim.rotate(0, 1600); });
  });
}
