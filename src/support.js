import { animate, createTimeline, stagger, svg, utils } from 'animejs';
import { store } from './data.js';
import { EASE_OUT, reduceMotion, revealOnce } from './motion.js';

const isPlaceholder = (v) => !v || /^\[.*\]$/.test(v);

export function initSupport() {
  // Contact channels
  const wa = document.getElementById('ch-whatsapp');
  if (store.whatsapp) wa.href = `https://wa.me/${store.whatsapp}`;
  else { wa.removeAttribute('target'); wa.href = '#support-form'; wa.querySelector('em').textContent = '[WHATSAPP NUMBER]'; }
  const phone = document.getElementById('ch-phone');
  phone.href = isPlaceholder(store.phone) ? '#support-form' : `tel:${store.phone.replace(/\s/g, '')}`;
  const email = document.getElementById('ch-email');
  email.href = isPlaceholder(store.email) ? '#support-form' : `mailto:${store.email}`;

  const form = document.getElementById('support-form');
  const syncTopic = () => form.classList.toggle('is-repair', form.topic.value === 'repair');
  form.addEventListener('change', (e) => {
    syncTopic();
    if (e.target.name === 'topic' && !reduceMotion) {
      animate(e.target.closest('.chip'), { scale: [0.92, 1], duration: 700, ease: 'outElastic(1, .5)' });
      if (form.topic.value === 'repair') animate('.repair-only', { opacity: [0, 1], y: [-10, 0], duration: 600, ease: EASE_OUT });
    }
  });

  // Any link with data-topic pre-selects the form topic.
  document.querySelectorAll('[data-topic]').forEach((a) => a.addEventListener('click', () => {
    const radio = form.querySelector(`input[name="topic"][value="${a.dataset.topic}"]`);
    if (radio) { radio.checked = true; syncTopic(); }
  }));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send(form);
  });

  // Channel rows slide in
  if (!reduceMotion) {
    const rows = document.querySelectorAll('.channels li');
    utils.set(rows, { opacity: 0, x: -30 });
    revealOnce('.channels', rows, {
      opacity: [0, 1], x: [-30, 0], duration: 1000, delay: stagger(90), ease: EASE_OUT,
    });
  }
}

function send(form) {
  const status = form.querySelector('.form-status');
  const data = Object.fromEntries(new FormData(form));
  if (!data.name?.trim() || !data.phone?.trim() || !data.message?.trim()) {
    status.textContent = 'Please fill in your name, phone and message.';
    if (!reduceMotion) animate(form.querySelector('.submit'), { x: [0, -10, 10, -6, 6, 0], duration: 500, ease: 'inOut(2)' });
    return;
  }

  const text = `Kai Store — ${data.topic}\nName: ${data.name}\nPhone: ${data.phone}${data.model ? `\nModel: ${data.model}` : ''}\n\n${data.message}`;
  if (store.whatsapp) window.open(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');

  const label = form.querySelector('.submit-label');
  const icon = form.querySelector('.submit-icon path');
  status.textContent = 'Thanks — the Kai team will get back to you shortly.';
  form.reset();
  form.classList.remove('is-repair');

  if (reduceMotion) { label.textContent = 'Sent'; return; }

  // Arrow shoots off, label swaps, a check draws itself in.
  createTimeline()
    .add(icon.parentNode, { x: 40, opacity: 0, duration: 350, ease: 'in(3)' })
    .call(() => { label.textContent = 'Sent'; icon.setAttribute('d', 'M5 12.5l4.5 4.5L19 7.5'); })
    .add(icon.parentNode, { x: 0, opacity: 1, duration: 10 })
    .add(svg.createDrawable(icon), { draw: ['0 0', '0 1'], duration: 600, ease: 'inOut(3)' })
    .add(status, { opacity: [0, 1], y: [10, 0], duration: 700, ease: EASE_OUT }, '<<')
    .call(() => {
      setTimeout(() => {
        label.textContent = 'Send message';
        icon.setAttribute('d', 'M5 12h14M13 6l6 6-6 6');
        utils.set(icon, { strokeDasharray: 'none', strokeDashoffset: 0 });
      }, 4000);
    });
}
