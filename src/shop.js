import { animate, createAnimatable, createTimeline, splitText, stagger, svg, utils } from 'animejs';
import { products, store, formatPrice } from './data.js';
import { EASE_OUT, finePointer, magnetize, reduceMotion, revealOnce } from './motion.js';
import { openOverlay, closeOverlay } from './overlay.js';

const $ = (s, r = document) => r.querySelector(s);
const BAG_KEY = 'kai-bag';

// ───────── Bag state ─────────
let bag = [];
try { bag = JSON.parse(localStorage.getItem(BAG_KEY)) || []; } catch { bag = []; }
const saveBag = () => {
  try { localStorage.setItem(BAG_KEY, JSON.stringify(bag)); } catch { /* storage unavailable */ }
  renderBagCount();
};
const findProduct = (id) => products.find((p) => p.id === id);

function renderBagCount(bump = false) {
  const n = bag.reduce((s, i) => s + i.qty, 0);
  const el = $('.bag-count');
  el.textContent = n;
  if (bump && !reduceMotion) animate(el, { scale: [1.7, 1], duration: 900, ease: 'outElastic(1, .4)' });
}

// ───────── Grid ─────────
export function initShop() {
  const grid = $('#grid');
  grid.innerHTML = products.map((p) => `
    <button type="button" class="card" data-id="${p.id}" data-brand="${p.brand}" data-cond="${p.condition}" data-cursor="View">
      <span class="card-media">
        <span class="card-tag ${p.condition === 'pre-owned' ? 'pre' : ''}">${p.condition === 'pre-owned' ? 'Certified pre-owned' : 'New'}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy" class="${p.fit === 'contain' ? 'contain' : ''}" />
        <span class="card-quick">Quick buy <span aria-hidden="true">+</span></span>
      </span>
      <span class="card-body">
        <span><span class="card-brand">${p.brandLabel}</span><span class="card-name">${p.name}</span></span>
        <span class="card-price">${formatPrice(p.price)}</span>
      </span>
    </button>`).join('');

  const cards = [...grid.children];
  cards.forEach((card) => {
    card.addEventListener('click', () => openProduct(card.dataset.id, card));
    tilt(card);
  });

  if (!reduceMotion) {
    utils.set(cards, { opacity: 0, y: 60 });
    revealOnce(grid, cards, { opacity: [0, 1], y: [60, 0], duration: 1200, delay: stagger(90), ease: EASE_OUT });
  }

  // Filters
  document.querySelectorAll('.filters .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (chip.classList.contains('is-active')) return;
      document.querySelectorAll('.filters .chip').forEach((c) => {
        c.classList.toggle('is-active', c === chip);
        c.setAttribute('aria-pressed', String(c === chip));
      });
      applyFilter(cards, chip.dataset.filter);
    });
  });

  initProductDialog();
  initBag();
  renderBagCount();
}

const matches = (card, f) =>
  f === 'all' || card.dataset.brand === f || card.dataset.cond === f;

function applyFilter(cards, f) {
  const show = () => {
    cards.forEach((c) => { c.hidden = !matches(c, f); });
    const visible = cards.filter((c) => !c.hidden);
    if (reduceMotion) return;
    animate(visible, {
      opacity: [0, 1], y: [50, 0], scale: [0.96, 1],
      duration: 1000, delay: stagger(70), ease: EASE_OUT,
    });
  };
  if (reduceMotion) return show();
  animate(cards.filter((c) => !c.hidden), {
    opacity: 0, y: -20, scale: 0.97, duration: 380, delay: stagger(30), ease: 'in(3)',
    onComplete: show,
  });
}

/** Cards lean toward the cursor in 3D. */
function tilt(card) {
  if (!finePointer || reduceMotion) return;
  const t = createAnimatable(card, { rotateX: 700, rotateY: 700, ease: 'out(3)' });
  card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    t.rotateY(((e.clientX - r.left) / r.width - 0.5) * 10);
    t.rotateX(-((e.clientY - r.top) / r.height - 0.5) * 10);
  });
  card.addEventListener('pointerleave', () => {
    t.rotateX(0, 1200, 'outElastic(1, .5)');
    t.rotateY(0, 1200, 'outElastic(1, .5)');
  });
}

// ───────── Product dialog ─────────
const sel = { id: null, color: 0, storage: 0, qty: 1 };
let nameSplit = null;

function initProductDialog() {
  const overlay = $('#product-overlay');
  overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeProduct));
  $('#qty-dec').addEventListener('click', () => setQty(sel.qty - 1));
  $('#qty-inc').addEventListener('click', () => setQty(sel.qty + 1));
  $('#pp-add').addEventListener('click', addToBag);
}

function setQty(n) {
  sel.qty = Math.max(1, Math.min(9, n));
  const el = $('#qty-val');
  el.textContent = sel.qty;
  if (!reduceMotion) animate(el, { y: [-8, 0], opacity: [0, 1], duration: 400, ease: EASE_OUT });
}

function renderOptions(p) {
  const colors = $('#pp-colors');
  colors.innerHTML = p.colors.map((c, i) => `
    <button type="button" class="swatch" aria-label="${c.name}" aria-pressed="${i === sel.color}" data-i="${i}">
      <span style="background:${c.hex}"></span></button>`).join('');
  $('#pp-color-name').textContent = p.colors[sel.color].name;
  colors.querySelectorAll('.swatch').forEach((b) => b.addEventListener('click', () => {
    sel.color = +b.dataset.i;
    colors.querySelectorAll('.swatch').forEach((s) => s.setAttribute('aria-pressed', String(s === b)));
    $('#pp-color-name').textContent = p.colors[sel.color].name;
    if (!reduceMotion) animate(b, { scale: [0.8, 1], duration: 700, ease: 'outElastic(1, .5)' });
  }));

  const storage = $('#pp-storage');
  storage.innerHTML = p.storage.map((s, i) => `
    <button type="button" class="option" aria-pressed="${i === sel.storage}" data-i="${i}">${s}</button>`).join('');
  storage.querySelectorAll('.option').forEach((b) => b.addEventListener('click', () => {
    sel.storage = +b.dataset.i;
    storage.querySelectorAll('.option').forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
  }));
}

function resetAddButton() {
  $('#add-path').setAttribute('d', 'M12 5v14M5 12h14');
  utils.set('#add-path', { strokeDasharray: 'none', strokeDashoffset: 0 });
  utils.set('.add-icon', { scale: 1, rotate: 0 });
  $('#pp-add-label').textContent = 'Add to bag';
}

function openProduct(id, fromCard) {
  const p = findProduct(id);
  Object.assign(sel, { id, color: 0, storage: 0, qty: 1 });
  const img = $('#pp-img');
  img.src = p.img;
  img.alt = p.name;
  img.className = p.fit === 'contain' ? 'contain' : '';
  $('#pp-brand').textContent = `${p.brandLabel} · ${p.condition === 'pre-owned' ? 'Certified pre-owned' : 'New'}`;
  const name = $('#pp-name');
  if (nameSplit) nameSplit.revert();
  name.textContent = p.name;
  nameSplit = splitText(name, { words: { wrap: 'clip' }, chars: true });
  $('#pp-price').textContent = formatPrice(p.price);
  $('#qty-val').textContent = '1';
  resetAddButton();
  renderOptions(p);

  const overlay = $('#product-overlay');
  openOverlay(overlay, fromCard, closeProduct);
  magnetize(overlay);
  if (reduceMotion) return;

  const panel = overlay.querySelector('.product-panel');
  createTimeline({ defaults: { ease: EASE_OUT } })
    .add(overlay.querySelector('.overlay-bg'), { opacity: [0, 1], duration: 500, ease: 'out(2)' }, 0)
    .add(panel, {
      clipPath: ['inset(100% 0% 0% 0% round 32px)', 'inset(0% 0% 0% 0% round 32px)'],
      duration: 1000, ease: 'inOut(4)',
    }, 0)
    .add(img, { scale: [1.35, 1], duration: 1600 }, 150)
    .add(nameSplit.chars, { y: ['110%', '0%'], duration: 1000, delay: stagger(20) }, 450)
    .add(panel.querySelectorAll('.pp-info > :not(#pp-name), .close'), {
      opacity: [0, 1], y: [24, 0], duration: 900, delay: stagger(60),
    }, 500);
}

function closeProduct() {
  const overlay = $('#product-overlay');
  if (reduceMotion) return closeOverlay(overlay);
  createTimeline({ defaults: { ease: 'in(3)' } })
    .add(overlay.querySelector('.product-panel'), {
      clipPath: 'inset(0% 0% 100% 0% round 32px)', duration: 650, ease: 'inOut(3)',
    }, 0)
    .add(overlay.querySelector('.overlay-bg'), { opacity: 0, duration: 500 }, 200)
    .call(() => closeOverlay(overlay));
}

function addToBag() {
  const p = findProduct(sel.id);
  const line = { id: p.id, color: p.colors[sel.color].name, storage: p.storage[sel.storage], qty: sel.qty };
  const same = bag.find((i) => i.id === line.id && i.color === line.color && i.storage === line.storage);
  if (same) same.qty = Math.min(9, same.qty + line.qty); else bag.push(line);
  saveBag();
  renderBagItems();

  if (reduceMotion) {
    $('#pp-add-label').textContent = 'Added';
    renderBagCount();
    return;
  }

  // Button: plus spins away, a check draws in.
  const path = $('#add-path');
  createTimeline()
    .add('.add-icon', { scale: 0, rotate: 90, duration: 260, ease: 'in(3)' })
    .call(() => {
      path.setAttribute('d', 'M5 12.5l4.5 4.5L19 7.5');
      $('#pp-add-label').textContent = 'Added to bag';
    })
    .add('.add-icon', { scale: 1, rotate: 0, duration: 10 })
    .add(svg.createDrawable(path), { draw: ['0 0', '0 1'], duration: 600, ease: 'inOut(3)' });

  flyToBag($('#pp-img'));
}

/** A thumbnail arcs from the product image into the bag button. */
function flyToBag(img) {
  const from = img.getBoundingClientRect();
  const to = $('.bag-btn').getBoundingClientRect();
  const size = 120;
  const ghost = document.createElement('img');
  ghost.src = img.src;
  ghost.alt = '';
  Object.assign(ghost.style, {
    position: 'fixed', zIndex: 140, width: `${size}px`, height: `${size}px`, objectFit: 'cover',
    borderRadius: '50%', left: `${from.left + from.width / 2 - size / 2}px`, top: `${from.top + from.height / 2 - size / 2}px`,
    pointerEvents: 'none', boxShadow: '0 20px 40px rgba(0,0,0,.35)',
  });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  animate(ghost, {
    x: { to: dx, ease: 'inOut(3)' },
    y: [{ to: dy - 160, duration: 450, ease: 'out(2)' }, { to: dy, duration: 650, ease: 'in(3)' }],
    scale: [{ to: 0.9, duration: 300 }, { to: 0.12, duration: 800, ease: 'in(2)' }],
    duration: 1100,
    onComplete: () => { ghost.remove(); renderBagCount(true); },
  });
}

// ───────── Bag drawer + checkout ─────────
function initBag() {
  const overlay = $('#bag-overlay');
  $('.bag-btn').addEventListener('click', openBag);
  overlay.querySelectorAll('[data-close]').forEach((b) => b.addEventListener('click', closeBag));

  const form = $('#checkout');
  const syncAddress = () => {
    const delivery = form.fulfil.value === 'Delivery';
    form.querySelector('.address-field').hidden = !delivery;
  };
  form.addEventListener('change', syncAddress);
  syncAddress();
  form.addEventListener('submit', (e) => { e.preventDefault(); placeOrder(form); });
  renderBagItems();
}

function bagTotal() {
  const priced = bag.every((i) => typeof findProduct(i.id)?.price === 'number');
  if (!bag.length) return formatPrice(0);
  if (!priced) return 'Confirmed by the team';
  return formatPrice(bag.reduce((s, i) => s + findProduct(i.id).price * i.qty, 0));
}

function renderBagItems() {
  const list = $('#bag-items');
  bag = bag.filter((i) => findProduct(i.id));
  list.innerHTML = bag.map((i, idx) => {
    const p = findProduct(i.id);
    return `<li class="bag-item" data-idx="${idx}">
      <img src="${p.img}" alt="" class="${p.fit === 'contain' ? 'contain' : ''}" />
      <span><strong>${p.name}</strong><small>${i.color} · ${i.storage} · Qty ${i.qty}</small></span>
      <button type="button" class="bag-remove" data-idx="${idx}">Remove</button>
    </li>`;
  }).join('');
  $('#bag-empty').hidden = bag.length > 0;
  $('#checkout').hidden = bag.length === 0;
  $('#bag-total').textContent = bagTotal();
  list.querySelectorAll('.bag-remove').forEach((b) => b.addEventListener('click', () => removeItem(+b.dataset.idx, b.closest('li'))));
}

function removeItem(idx, li) {
  const done = () => { bag.splice(idx, 1); saveBag(); renderBagItems(); };
  if (reduceMotion) return done();
  animate(li, { x: 60, opacity: 0, duration: 450, ease: 'in(3)', onComplete: done });
}

function openBag() {
  const overlay = $('#bag-overlay');
  $('#order-done').hidden = true;
  renderBagItems();
  openOverlay(overlay, $('.bag-btn'), closeBag);
  if (reduceMotion) return;
  createTimeline({ defaults: { ease: EASE_OUT } })
    .add(overlay.querySelector('.overlay-bg'), { opacity: [0, 1], duration: 500 }, 0)
    .add(overlay.querySelector('.drawer'), { x: ['105%', '0%'], duration: 1000, ease: 'out(5)' }, 0)
    .add(overlay.querySelectorAll('.drawer-head, .bag-item, .bag-empty, .checkout > *'), {
      opacity: [0, 1], x: [40, 0], duration: 800, delay: stagger(45),
    }, 250);
}

function closeBag() {
  const overlay = $('#bag-overlay');
  if (reduceMotion) return closeOverlay(overlay);
  createTimeline()
    .add(overlay.querySelector('.drawer'), { x: '105%', duration: 700, ease: 'inOut(4)' }, 0)
    .add(overlay.querySelector('.overlay-bg'), { opacity: 0, duration: 500, ease: 'in(2)' }, 200)
    .call(() => closeOverlay(overlay));
}

function placeOrder(form) {
  const status = form.querySelector('.form-status');
  const data = Object.fromEntries(new FormData(form));
  const needAddress = data.fulfil === 'Delivery';
  const missing = !data.name?.trim() || !data.phone?.trim() || (needAddress && !data.address?.trim());
  if (missing) {
    status.textContent = needAddress ? 'Please add your name, phone and delivery address.' : 'Please add your name and phone.';
    if (!reduceMotion) animate(form.querySelector('.submit'), { x: [0, -10, 10, -6, 6, 0], duration: 500, ease: 'inOut(2)' });
    return;
  }
  status.textContent = '';

  const lines = bag.map((i) => `• ${i.qty} × ${findProduct(i.id).name} (${i.color}, ${i.storage})`).join('\n');
  const message = `New order — Kai Store\n${lines}\nTotal: ${bagTotal()}\n\nName: ${data.name}\nPhone: ${data.phone}\n${data.fulfil}${needAddress ? `: ${data.address}` : ''}\nPay with: ${data.pay}`;
  if (store.whatsapp) window.open(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');

  bag = [];
  saveBag();
  form.reset();
  form.hidden = true;
  $('#bag-items').innerHTML = '';
  const done = $('#order-done');
  done.hidden = false;
  if (reduceMotion) return;
  const [ring, check] = svg.createDrawable(done.querySelectorAll('.done-ring, .done-check'));
  createTimeline({ defaults: { ease: 'inOut(3)' } })
    .add(ring, { draw: ['0 0', '0 1'], duration: 900 })
    .add(check, { draw: ['0 0', '0 1'], duration: 600 }, '-=200')
    .add(done.querySelectorAll('h4, p'), { opacity: [0, 1], y: [20, 0], duration: 800, delay: stagger(80), ease: EASE_OUT }, '-=400');
}
