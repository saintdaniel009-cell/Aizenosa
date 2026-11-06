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

(function () {
  var form = document.getElementById('enquiry');
  if (!form) return;
  var EMAIL = 'hello@aizenosaabu.com';
  var msg = form.querySelector('.f-msg');
  var btn = form.querySelector('.f-btn');
  var radios = form.querySelectorAll('input[name="Enquiry type"]');
  var branches = form.querySelectorAll('.branch');
  var pkgSel = form.querySelector('select[name="Package"]');
  var projSel = form.querySelector('select[name="Project type"]');

  function show(type) {
    branches.forEach(function (b) {
      var on = b.dataset.branch === type;
      b.hidden = !on; b.disabled = !on;
    });
    radios.forEach(function (r) { r.checked = r.dataset.type === type; });
    form.querySelector('.seg').classList.remove('bad');
  }
  radios.forEach(function (r) { r.addEventListener('change', function () { show(r.dataset.type); }); });

  function markPkg(k) {
    document.querySelectorAll('.pkg').forEach(function (p) {
      var b = p.querySelector('.pkg-btn'); p.classList.toggle('picked', !!k && b && b.dataset.package === k);
    });
  }
  if (pkgSel) pkgSel.addEventListener('change', function () { var o = pkgSel.selectedOptions[0]; markPkg(o && o.dataset.k); });

  document.querySelectorAll('[data-package],[data-project],a[data-type]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (a.dataset.package) {
        show('retainer');
        Array.prototype.forEach.call(pkgSel.options, function (o) { if (o.dataset.k === a.dataset.package) pkgSel.value = o.value; });
        markPkg(a.dataset.package);
      } else if (a.dataset.project) {
        show('project'); projSel.value = a.dataset.project;
      } else { show(a.dataset.type); }
    });
  });

  form.addEventListener('input', function (e) { e.target.classList && e.target.classList.remove('bad'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    msg.textContent = ''; msg.classList.remove('err');
    var checked = form.querySelector('input[name="Enquiry type"]:checked');
    var firstBad = null;
    if (!checked) { form.querySelector('.seg').classList.add('bad'); firstBad = radios[0]; }
    form.querySelectorAll('input,select,textarea').forEach(function (el) {
      if (el.disabled || el.type === 'radio' || el.type === 'checkbox') return;
      if (!el.checkValidity()) { el.classList.add('bad'); if (!firstBad) firstBad = el; }
    });
    if (firstBad) {
      msg.textContent = 'Please fill in the highlighted fields.'; msg.classList.add('err');
      firstBad.focus({ preventScroll: false }); return;
    }
    var data = {};
    new FormData(form).forEach(function (v, k) { if (v === '') return; data[k] = data[k] ? data[k] + ', ' + v : v; });
    if (data._honey) return;
    data._subject = 'New ' + checked.value.toLowerCase() + ' enquiry from ' + (data.Name || 'the website');
    data._template = 'table';
    data._captcha = 'false';
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch('https://formsubmit.co/ajax/' + EMAIL, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data)
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) !== 'true') throw new Error(j.message || 'Failed'); }); })
      .then(function () {
        var sec = form.closest('section');
        sec.querySelector('.grid').hidden = true;
        var done = sec.querySelector('.f-done'); done.hidden = false;
        sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      })
      .catch(function () {
        btn.disabled = false; btn.innerHTML = 'Send enquiry &rarr;';
        msg.innerHTML = 'That didn’t send. Please email <a class="u" href="mailto:' + EMAIL + '">' + EMAIL + '</a> or try again.';
        msg.classList.add('err');
      });
  });
})();
