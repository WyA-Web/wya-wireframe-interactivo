/* Wireframe Mid-Fi · Grupo WYA · sin librerías */
const CASCADA_MS = 80;    // desfase entre elementos de un grupo

(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const movil = matchMedia('(max-width: 899px)');
  const puntero = matchMedia('(hover: hover) and (pointer: fine)');

  /* ---- Header ---- */
  const header = $('[data-header]');
  const alBajar = () => header.classList.toggle('is-fixed', scrollY > 40);
  addEventListener('scroll', alBajar, { passive: true });
  alBajar();

  /* ---- Desplegables: mouse, clic, teclado y Escape ---- */
  const drops = $$('[data-drop]').map(el => ({ el, btn: $('button', el), porHover: false, reloj: 0 }));
  const abrir = (d, v) => { clearTimeout(d.reloj); d.btn.setAttribute('aria-expanded', v); if (!v) d.porHover = false; };
  const abierto = d => d.btn.getAttribute('aria-expanded') === 'true';
  const cerrarDrops = menos => drops.forEach(d => d !== menos && abrir(d, false));
  drops.forEach(d => {
    d.el.addEventListener('mouseenter', () => {
      clearTimeout(d.reloj);
      if (!puntero.matches || movil.matches || abierto(d)) return;
      cerrarDrops(d); abrir(d, true); d.porHover = true;
    });
    d.el.addEventListener('mouseleave', () => {
      if (d.porHover) d.reloj = setTimeout(() => abrir(d, false), 150);
    });
    d.btn.addEventListener('click', () => {
      if (d.porHover) { d.porHover = false; return; }  // ya lo abrió el mouse: el clic lo deja abierto
      const v = !abierto(d); cerrarDrops(d); abrir(d, v);
    });
    d.el.addEventListener('focusout', e => { if (!movil.matches && e.relatedTarget && !d.el.contains(e.relatedTarget)) abrir(d, false); });
    $$('a', d.el).forEach(a => a.addEventListener('click', () => abrir(d, false)));
  });
  document.addEventListener('click', e => { if (!e.target.closest('[data-drop]')) cerrarDrops(); });

  /* ---- Menú móvil ---- */
  const burger = $('[data-burger]');
  const menu = v => {
    header.classList.toggle('is-open', v);
    burger.setAttribute('aria-expanded', v);
    burger.setAttribute('aria-label', v ? 'Cerrar menú' : 'Abrir menú');
    if (!v) cerrarDrops();
  };
  const menuAbierto = () => header.classList.contains('is-open');
  burger.addEventListener('click', () => menu(!menuAbierto()));
  $$('[data-menu] a').forEach(a => a.addEventListener('click', () => menu(false)));
  movil.addEventListener('change', () => menu(false));
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const d = drops.find(abierto);
    if (d) { const dentro = d.el.contains(document.activeElement); abrir(d, false); if (dentro) d.btn.focus(); }
    else if (menuAbierto()) { menu(false); burger.focus(); }
  });

  /* ---- Entradas ---- */
  $$('.sol__cards, .logos').forEach(g => $$('.rv', g).forEach((el, i) => el.style.setProperty('--d', i * CASCADA_MS + 'ms')));
  $$('.paso').forEach((el, i) => el.style.setProperty('--d', i * CASCADA_MS * 2 + 'ms'));
  $$('.ui__barras').forEach(g => $$('i', g).forEach((el, n) => el.style.setProperty('--n', n)));
  $$('.ui--etapas p').forEach((el, n) => el.style.setProperty('--n', n * 3));
  $$('.mods path').forEach((el, n) => el.style.setProperty('--d', n * 30 + 'ms'));
  const rv = $$('.rv, .mods');
  if ('IntersectionObserver' in window) {
    const alEntrar = (es, io) => es.forEach(e => {
      if (!e.isIntersecting && e.boundingClientRect.top > 0) return;  // lo que ya quedó arriba también se muestra
      e.target.classList.add('is-in'); io.unobserve(e.target);
    });
    const io = new IntersectionObserver(alEntrar, { threshold: .12 });
    // Las tarjetas de Soluciones se asoman en la primera pantalla: basta con que se vea un borde
    const ioAsoma = new IntersectionObserver(alEntrar, { rootMargin: '0px 0px 24px' });
    rv.forEach(el => (el.matches('.scard') ? ioAsoma : io).observe(el));
  } else rv.forEach(el => el.classList.add('is-in'));
  // Si el foco llega a algo que aún no entró, se muestra de inmediato
  document.addEventListener('focusin', e => { const el = e.target.closest('.rv'); if (el) el.classList.add('is-in'); });
  requestAnimationFrame(() => requestAnimationFrame(() => $('.portada').classList.add('is-loaded')));

  /* ---- Video y destinos por definir ---- */
  const msg = $('[data-video-msg]');
  $('[data-play]').addEventListener('click', () => { msg.textContent = 'Video por definir'; msg.classList.add('is-on'); });
  const toast = $('[data-toast]');
  let relojToast = 0;
  $$('[data-pendiente]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    toast.textContent = 'Enlace por definir'; toast.classList.add('is-on');
    clearTimeout(relojToast); relojToast = setTimeout(() => toast.classList.remove('is-on'), 2400);
  }));

  window.__wyaListo = true;
})();
