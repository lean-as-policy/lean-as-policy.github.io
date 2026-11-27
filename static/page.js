// Play videos only while they are on screen; paired comparison videos restart together.
(function () {
  var vids = document.querySelectorAll('video[data-autoplay]');
  if (!('IntersectionObserver' in window)) {
    vids.forEach(function (v) { v.preload = 'metadata'; v.play().catch(function () {}); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { v.play().catch(function () {}); }
      else if (!v.paused) { v.pause(); }
    });
  }, { threshold: 0.35 });
  vids.forEach(function (v) { io.observe(v); });

  // Paired clips: when the shorter one loops, restart its partner so both start from the same scene.
  var groups = {};
  document.querySelectorAll('video[data-sync]').forEach(function (v) {
    (groups[v.dataset.sync] = groups[v.dataset.sync] || []).push(v);
  });
  Object.keys(groups).forEach(function (k) {
    var g = groups[k];
    g.forEach(function (v) {
      v.loop = false;
      v.addEventListener('ended', function () {
        if (g.every(function (x) { return x.ended || x.paused; })) {
          g.forEach(function (x) { x.currentTime = 0; x.play().catch(function () {}); });
        }
      });
    });
  });
})();

// Tabs and step panels of the pipeline demo.
document.querySelectorAll('[data-demo]').forEach(function (demo) {
  var tabs = demo.querySelectorAll('.tabs button');
  var panes = demo.querySelectorAll('.demo-pane');
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x, j) { x.setAttribute('aria-selected', i === j); });
      panes.forEach(function (p, j) {
        p.hidden = i !== j;
        p.querySelectorAll('video').forEach(function (v) { if (i === j) v.play().catch(function () {}); else v.pause(); });
      });
    });
  });
  panes.forEach(function (pane) {
    var steps = pane.querySelectorAll('.steps button');
    var panels = pane.querySelectorAll('.step-panel');
    var go = function (k) {
      steps.forEach(function (s, j) { s.setAttribute('aria-selected', j === k); });
      panels.forEach(function (p, j) { p.hidden = j !== k; });
      pane.dataset.step = k;
    };
    steps.forEach(function (s, i) { s.addEventListener('click', function () { go(i); }); });
    pane.querySelectorAll('[data-next]').forEach(function (b) {
      b.addEventListener('click', function () { go(Math.min(steps.length - 1, (+pane.dataset.step || 0) + 1)); });
    });
    pane.querySelectorAll('[data-prev]').forEach(function (b) {
      b.addEventListener('click', function () { go(Math.max(0, (+pane.dataset.step || 0) - 1)); });
    });
    go(0);
  });
});

// Lean library: pressing a family lights up the law bricks it calls.
(function () {
  var fams = document.querySelectorAll('.fam');
  var bricks = document.querySelectorAll('.brick');
  var show = function (f) {
    fams.forEach(function (x) { x.setAttribute('aria-pressed', x === f); });
    var uses = (f.dataset.uses || '').split(/\s+/);
    bricks.forEach(function (b) { b.classList.toggle('on', uses.indexOf(b.dataset.law) >= 0); });
    var i = Array.prototype.indexOf.call(fams, f);
    document.querySelectorAll('.famcode').forEach(function (c) { c.hidden = String(i) !== c.dataset.code; });
  };
  fams.forEach(function (f) { f.addEventListener('click', function () { show(f); }); });
  if (fams.length) show(fams[0]);
})();

document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var text = document.getElementById(btn.dataset.copy).textContent;
    var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
  });
});

// Comparison tabs.
document.querySelectorAll('[data-vs]').forEach(function (box) {
  var tabs = box.querySelectorAll('.tabs button');
  var panes = box.querySelectorAll('.vs-pane');
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x, j) { x.setAttribute('aria-selected', i === j); });
      panes.forEach(function (p, j) { p.hidden = i !== j; });
    });
  });
});
