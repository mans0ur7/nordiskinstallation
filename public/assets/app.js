/* Nordisk Installation — bevægelse og lys. Ingen dependencies. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Mobilmenu ---------- */

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("primary-nav");

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Åbn menu");
    nav.setAttribute("data-open", "false");
    document.body.style.removeProperty("overflow");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Åbn menu" : "Luk menu");
      nav.setAttribute("data-open", String(!open));
      document.body.style.overflow = open ? "" : "hidden";
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) closeNav();
    });
  }

  /* ---------- Header + scroll-indikator ---------- */

  var header = document.querySelector(".site-header");
  var progress = document.querySelector(".progress");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.setAttribute("data-scrolled", String(y > 12));

    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
    }
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(onScroll);
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Lyskeglen i toppen følger markøren ---------- */

  var hero = document.querySelector(".hero");

  if (hero && !reduced && window.matchMedia("(pointer: fine)").matches) {
    hero.addEventListener(
      "pointermove",
      function (e) {
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        hero.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
        hero.setAttribute("data-live", "true");
      },
      { passive: true }
    );
    hero.addEventListener("pointerleave", function () {
      hero.setAttribute("data-live", "false");
    });
  }

  /* ---------- Lyset på kortene følger markøren ---------- */

  if (!reduced && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".card").forEach(function (card) {
      card.addEventListener(
        "pointermove",
        function (e) {
          var r = card.getBoundingClientRect();
          card.style.setProperty("--gx", e.clientX - r.left + "px");
          card.style.setProperty("--gy", e.clientY - r.top + "px");
        },
        { passive: true }
      );
    });
  }

  /* ---------- Indhold der driver ind nedefra ---------- */

  var targets = document.querySelectorAll(".reveal, .steps li");

  if (!("IntersectionObserver" in window) || reduced) {
    targets.forEach(function (el) { el.classList.add("is-visible"); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
        // Ryd stagger-forsinkelsen når indtoningen er ovre — ellers
        // forsinker den også alle senere hover-transitions på elementet.
        window.setTimeout(function () {
          entry.target.style.removeProperty("transition-delay");
        }, 1600);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.06 }
  );

  targets.forEach(function (el) {
    // Elementer i samme række må ikke ramme helt samtidig — det virker mekanisk.
    var group = el.parentElement;
    var index = group ? Array.prototype.indexOf.call(group.children, el) : 0;
    el.style.transitionDelay = Math.min(index, 5) * 110 + "ms";
    observer.observe(el);
  });
})();
