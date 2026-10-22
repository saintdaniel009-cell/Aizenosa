(function () {
  var root = document.documentElement;
  var burger = document.querySelector('.burger');
  var backdrop = document.querySelector('.backdrop');
  var items = document.querySelectorAll('.d-item');

  function setOpen(open) {
    root.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    items.forEach(function (el) {
      el.style.transitionDelay = open ? (el.dataset.delay || 0) + 'ms' : '0ms';
    });
  }
  if (burger) burger.addEventListener('click', function () { setOpen(!root.classList.contains('open')); });
  if (backdrop) backdrop.addEventListener('click', function () { setOpen(false); });
  document.querySelectorAll('.drawer a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }
})();

(function () {
  var reels = Array.prototype.slice.call(document.querySelectorAll('.reel'));
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function stop(r) { var v = r.querySelector('video'); v.pause(); r.classList.remove('playing'); }
  reels.forEach(function (r) {
    var v = r.querySelector('video');
    v.addEventListener('ended', function () { r.classList.remove('playing'); });
    function toggle() {
      if (r.classList.contains('playing') && !v.muted) { stop(r); return; }
      reels.forEach(function (o) { if (o !== r) stop(o); });
      v.muted = false; v.play(); r.classList.add('playing');
    }
    r.addEventListener('click', toggle);
    r.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    if (fine) {
      r.addEventListener('mouseenter', function () { if (!r.classList.contains('playing')) { v.muted = true; v.play().catch(function(){}); } });
      r.addEventListener('mouseleave', function () { if (v.muted) { v.pause(); } });
    }
  });
})();
