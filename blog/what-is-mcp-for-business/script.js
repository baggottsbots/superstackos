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

// Mobile menu toggle
    (function () {
      var btn = document.getElementById('nav-toggle');
      var menu = document.getElementById('mobile-menu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function () {
        var open = menu.classList.toggle('hidden') === false;
        btn.setAttribute('aria-expanded', String(open));
      });
    })();