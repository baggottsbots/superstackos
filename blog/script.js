tailwind.config = {
      theme: { extend: {
        colors: {
          ink: { DEFAULT: '#07070d', 900: '#0b0b14', 800: '#111120', 700: '#181829', 600: '#22223a' },
          brand: { 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
          volt: { 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4' }
        },
        fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] }
      } }
    }

gsap.registerPlugin(ScrollTrigger);

(function(){var b=document.getElementById('nav-toggle'),m=document.getElementById('mobile-menu');if(!b||!m)return;b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',String(o));});m.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){m.classList.remove('open');b.setAttribute('aria-expanded','false');});});})();

    // ===== HERO INTRO =====
    (function initHeroIntro() {
      gsap.set(['.hero-title', '.hero-sub', '.hero-ctas'], { autoAlpha: 0, y: 40 });
      gsap.set('.hero-badge', { autoAlpha: 0 });
      gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 }, onComplete: function(){ gsap.set(['.hero-badge', '.hero-title', '.hero-sub', '.hero-ctas'], { clearProps: 'transform,opacity,visibility' }); } })
        .to('.hero-badge', { autoAlpha: 1 }, 0.1)
        .to('.hero-title', { autoAlpha: 1, y: 0 }, '-=0.55')
        .to('.hero-sub', { autoAlpha: 1, y: 0 }, '-=0.6')
        .to('.hero-ctas', { autoAlpha: 1, y: 0 }, '-=0.6');
    })();

    // ===== SCROLL REVEALS =====
    (function initReveals() {
      var items = gsap.utils.toArray('.reveal');
      if (!items.length) return;
      gsap.set(items, { autoAlpha: 0, y: 40 });
      ScrollTrigger.batch(items, {
        start: 'top 92%',
        once: true,
        onEnter: function (els) {
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 });
        }
      });
    })();

    // ===== CATEGORY FILTER + SEARCH =====
    (function initFilters() {
      var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
      var input = document.getElementById('post-search');
      var featured = document.getElementById('featured-post');
      var items = Array.prototype.slice.call(document.querySelectorAll('.post-item'));
      var empty = document.getElementById('empty-state');
      var active = 'All';

      function matches(card) {
        var cat = card.getAttribute('data-category') || '';
        var hay = ((card.getAttribute('data-search') || '') + ' ' + card.textContent).toLowerCase();
        var q = (input.value || '').trim().toLowerCase();
        return (active === 'All' || cat === active) && (!q || hay.indexOf(q) !== -1);
      }

      function applyFilters() {
        var shown = 0;
        items.forEach(function (item) {
          var ok = matches(item.querySelector('a'));
          item.style.display = ok ? '' : 'none';
          if (ok) shown++;
        });
        if (featured) {
          var fOk = matches(featured);
          featured.style.display = fOk ? '' : 'none';
          if (fOk) shown++;
        }
        empty.classList.toggle('hidden', shown > 0);
        ScrollTrigger.refresh();
      }

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          active = chip.getAttribute('data-filter');
          chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
          applyFilters();
        });
      });
      input.addEventListener('input', applyFilters);
    })();

    window.addEventListener('load', function () { ScrollTrigger.refresh(); });