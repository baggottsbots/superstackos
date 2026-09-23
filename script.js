// ===== TAILWIND THEME EXTENSION =====
    // Purpose: Brand colors + font family so utility classes like bg-ink / text-brand-400 work.
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ink: { DEFAULT: '#07070d', 900: '#0b0b14', 800: '#111120', 700: '#181829', 600: '#22223a' },
            brand: { 300: '#c4b5fd', 400: '#a78bfa', 500: '#8b5cf6', 600: '#7c3aed' },
            volt: { 300: '#67e8f9', 400: '#22d3ee', 500: '#06b6d4' }
          },
          fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'] }
        }
      }
    }

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// ===== MOBILE MENU TOGGLE =====
    // Function: toggleMobileMenu()
    // Purpose: Show/hide navigation menu on mobile devices and update aria state
    // Triggers: Click on hamburger button; closes when a link is tapped
    (function toggleMobileMenu() {
      var btn = document.getElementById('nav-toggle');
      var menu = document.getElementById('mobile-menu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function () {
        var open = menu.classList.toggle('hidden') === false;
        btn.setAttribute('aria-expanded', String(open));
      });
      menu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          menu.classList.add('hidden');
          btn.setAttribute('aria-expanded', 'false');
        });
      });
    })();

    // ===== HERO INTRO TIMELINE =====
    // Function: initHeroIntro()
    // Purpose: Stagger badge → headline → subtext → CTAs → dashboard in from hidden on load
    // Note: Hidden states are set ONLY here in JS so content is visible without JavaScript
    (function initHeroIntro() {
      gsap.set(['.hero-badge', '.hero-title', '.hero-sub', '.hero-ctas', '.hero-meta'], { autoAlpha: 0, y: 48 });
      gsap.set('.hero-visual', { autoAlpha: 0, y: 90, scale: 0.94 });
      gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.9 } })
        .to('.hero-badge', { autoAlpha: 1, y: 0 }, 0.1)
        .to('.hero-title', { autoAlpha: 1, y: 0 }, '-=0.6')
        .to('.hero-sub', { autoAlpha: 1, y: 0 }, '-=0.65')
        .to('.hero-ctas', { autoAlpha: 1, y: 0 }, '-=0.65')
        .to('.hero-meta', { autoAlpha: 1, y: 0, duration: 0.7 }, '-=0.6')
        .to('.hero-visual', { autoAlpha: 1, y: 0, scale: 1, duration: 1.2 }, '-=0.7');
    })();

    // ===== SCROLL REVEALS =====
    // Function: initReveals()
    // Purpose: Every .reveal element starts hidden/offset and fades up when entering viewport
    // Behaviour: once:true so content never re-hides; siblings stagger for a cascading feel
    (function initReveals() {
      var items = gsap.utils.toArray('.reveal');
      if (!items.length) return;
      gsap.set(items, { autoAlpha: 0, y: 48 });
      ScrollTrigger.batch(items, {
        start: 'top 85%',
        once: true,
        onEnter: function (els) {
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 });
        }
      });
    })();

    // ===== ANIMATED STAT COUNTERS =====
    // Function: initCounters()
    // Purpose: Count each .counter from 0 to its data-count value when scrolled into view
    // Edit: Change data-count / data-suffix attributes in the STATS section
    (function initCounters() {
      document.querySelectorAll('.counter').forEach(function (el) {
        var target = parseFloat(el.getAttribute('data-count')) || 0;
        var suffix = el.getAttribute('data-suffix') || '';
        var obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          snap: { v: 1 },
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString() + suffix; }
        });
      });
    })();

    // ===== STACK REPLACEMENT PINNED SCENE =====
    // Function: initStackScene()
    // Purpose: Pin the section and, as the user scrolls, pull every scattered SaaS card
    //          into the center where they collapse into the glowing SuperStackOS core
    // Behaviour: scrub:1 ties progress to scroll; headline A fades out, caption B fades in
    (function initStackScene() {
      var scene = document.querySelector('.stack-scene');
      var cards = gsap.utils.toArray('.stack-card');
      if (!scene || !cards.length) return;

      // Give each card its tilt from data-rot
      cards.forEach(function (c) { gsap.set(c, { rotation: parseFloat(c.getAttribute('data-rot')) || 0 }); });
      gsap.set('.stack-core', { scale: 0.7, autoAlpha: 0.35 });
      gsap.set('.stack-headline-b', { autoAlpha: 0, y: 40 });

      gsap.timeline({
        scrollTrigger: { trigger: scene, start: 'top top', end: '+=220%', pin: true, scrub: 1, anticipatePin: 1 }
      })
        .to(cards, {
          left: '50%', top: '50%', right: 'auto', xPercent: -50, yPercent: -50,
          rotation: 0, scale: 0.45, duration: 1.4, ease: 'power2.inOut', stagger: 0.06
        }, 0)
        .to('.stack-headline-a', { autoAlpha: 0, y: -40, duration: 0.5 }, 0.7)
        .to(cards, { autoAlpha: 0, duration: 0.35, stagger: 0.02 }, 1.35)
        .to('.stack-core', { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'power3.out' }, 1.3)
        .to('.stack-headline-b', { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 1.7)
        .to({}, { duration: 0.4 }); // brief hold at the end
    })();

    // ===== MCP FLOW PATH DRAW + TRACER DOT =====
    // Function: initFlowPath()
    // Purpose: Draw the SVG line down the "How it works" steps as you scroll and ride a
    //          glowing dot along it using MotionPathPlugin (scrubbed to scroll position)
    (function initFlowPath() {
      var path = document.getElementById('flowPath');
      var dot = document.getElementById('flowDot');
      var section = document.querySelector('.flow-steps');
      if (!path || !dot || !section) return;

      var len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top 65%', end: 'bottom 60%', scrub: 1 }
      })
        .to(path, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0)
        .to(dot, {
          motionPath: { path: '#flowPath', align: '#flowPath', alignOrigin: [0.5, 0.5] },
          ease: 'none', duration: 1
        }, 0);
    })();

    // ===== PRICING CHECKOUT (STRIPE VIA PLATFORM) =====
    // Function: handleBuyClick()
    // Purpose: Validate the shared email field, then call window.__processPayment with the
    //          tier's price (cents) and product name. Stripe Checkout handles the rest.
    // Edit: Prices live in data-cents / data-product / data-desc on each .buy-btn
    (function initCheckout() {
      var emailInput = document.getElementById('email');
      var nameInput = document.getElementById('name');
      var msg = document.getElementById('checkout-msg');
      var form = document.getElementById('checkout-form');

      function showMessage(text) {
        if (!msg) return;
        msg.textContent = text;
        msg.classList.remove('hidden');
      }
      function clearMessage() {
        if (!msg) return;
        msg.textContent = '';
        msg.classList.add('hidden');
      }
      if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
      if (emailInput) emailInput.addEventListener('input', clearMessage);

      function handleBuyClick(e) {
        var btn = e.currentTarget;
        var email = emailInput ? emailInput.value.trim() : '';
        var name = nameInput ? nameInput.value.trim() : '';
        var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (!valid) {
          showMessage('Please enter a valid work email above so we can send your login.');
          if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (emailInput) emailInput.focus();
          return;
        }

        if (typeof window.__processPayment !== 'function') {
          showMessage('Checkout is initializing. Please try again in a moment.');
          return;
        }

        btn.disabled = true;
        var original = btn.textContent;
        btn.textContent = 'Redirecting to secure checkout…';

        window.__processPayment({
          amountCents: parseInt(btn.getAttribute('data-cents'), 10),
          email: email,
          name: name,
          productName: btn.getAttribute('data-product'),
          productDescription: btn.getAttribute('data-desc'),
          quantity: 1
        });

        // Restore button if the redirect does not happen (e.g. user cancels)
        setTimeout(function () { btn.disabled = false; btn.textContent = original; }, 6000);
      }

      document.querySelectorAll('.buy-btn').forEach(function (btn) {
        btn.addEventListener('click', handleBuyClick);
      });
    })();

    // ===== REFRESH SCROLLTRIGGER AFTER FONTS/LAYOUT SETTLE =====
    // Function: refreshTriggers()
    // Purpose: Recalculate pinned/scrubbed positions once web fonts have loaded
    (function refreshTriggers() {
      window.addEventListener('load', function () { ScrollTrigger.refresh(); });
    })();