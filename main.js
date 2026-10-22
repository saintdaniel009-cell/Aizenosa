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
