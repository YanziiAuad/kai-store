import { store, repairs, credits } from './data.js';
import { initCursor } from './cursor.js';
import { heroAmbient, playIntro } from './intro.js';
import { magnetize, rollLinks } from './motion.js';
import { initScroll } from './scroll.js';
import { initShop } from './shop.js';
import { initSupport } from './support.js';

// ───────── Static content from data.js ─────────
document.querySelectorAll('[data-store]').forEach((el) => {
  el.textContent = store[el.dataset.store] ?? '';
});
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('hours').innerHTML = store.hours
  .map(([d, h]) => `<dt>${d}</dt><dd>${h}</dd>`).join('');
document.getElementById('credits').innerHTML = credits
  .map(([title, author, license, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${title}</a> — ${author}, ${license}</li>`)
  .join('');

const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
document.getElementById('repair-list').innerHTML = repairs.map((r) => `
  <li class="repair-row">
    <span class="fill"></span>
    <a href="#support" data-topic="repair" data-cursor="Book">
      <svg class="r-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${r.icon}"/></svg>
      <span><span class="repair-name">${r.name}</span><br/><span class="repair-note">${r.note}</span></span>
      <span class="repair-arrow">${arrow}</span>
    </a>
  </li>`).join('');

// ───────── Boot ─────────
initCursor();
rollLinks();
initShop();
initSupport();
magnetize();

playIntro(() => {
  heroAmbient();
  initScroll();
});

// Smooth in-page anchor scrolling.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || a.getAttribute('href') === '#') return;
  const target = document.querySelector(a.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});
