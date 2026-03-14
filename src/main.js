// Mobile menu toggle
(function initMobileMenu() {
  var menuBtn = document.getElementById('mobile-menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var iconOpen = document.getElementById('menu-icon-open');
  var iconClose = document.getElementById('menu-icon-close');
  var mobileLinks = document.querySelectorAll('#mobile-menu a');

  if (!menuBtn || !mobileMenu) return;

  function toggleMenu() {
    var isOpen = !mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden');
    iconClose.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }

  menuBtn.addEventListener('click', toggleMenu);

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.add('hidden');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// Header scroll effect
(function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let lastScroll = 0;
  const scrollThreshold = 50;

  function handleScroll() {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      header.classList.add('border-border-slate');
      header.classList.remove('border-transparent');
    } else {
      header.classList.remove('border-border-slate');
      header.classList.add('border-transparent');
    }

    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
})();

// Animated Mesh Background (only for index.html hero section)
(function initMesh() {
  var canvas = document.getElementById('hero-mesh');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var dpr = window.devicePixelRatio || 1;
  var points = [];
  var cols, rows, spacingX, spacingY;
  var CONNECT_DIST = 120;
  var DOT_RADIUS = 1.5;
  var LINE_COLOR = 'rgba(0, 229, 255, ';
  var DOT_COLOR = 'rgba(0, 229, 255, 0.6)';
  var animId = null;

  function resize() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    spacingX = 80;
    spacingY = 80;
    cols = Math.ceil(w / spacingX) + 1;
    rows = Math.ceil(h / spacingY) + 1;
    points = [];
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        points.push({
          x: c * spacingX,
          y: r * spacingY,
          baseX: c * spacingX,
          baseY: r * spacingY,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3
        });
      }
    }
  }

  function update(time) {
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      p.x += p.vx;
      p.y += p.vy;
      var dx = p.x - p.baseX;
      var dy = p.y - p.baseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 20) {
        p.vx *= -1;
        p.vy *= -1;
      }
    }
  }

  function draw() {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < points.length; i++) {
      var p1 = points[i];
      for (var j = i + 1; j < points.length; j++) {
        var p2 = points[j];
        var dx = p2.x - p1.x;
        var dy = p2.y - p1.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          var opacity = (1 - dist / CONNECT_DIST) * 0.3;
          ctx.strokeStyle = LINE_COLOR + opacity + ')';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = DOT_COLOR;
    for (var k = 0; k < points.length; k++) {
      var p = points[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function loop(time) {
    update(time);
    draw();
    animId = requestAnimationFrame(loop);
  }

  var heroSection = document.getElementById('hero');
  if (heroSection) {
    var meshObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        if (!animId) animId = requestAnimationFrame(loop);
      } else {
        if (animId) { cancelAnimationFrame(animId); animId = null; }
      }
    }, { threshold: 0 });
    meshObserver.observe(heroSection);
  }

  window.addEventListener('resize', function () {
    var prevDpr = dpr;
    dpr = window.devicePixelRatio || 1;
    resize();
  });

  resize();
  animId = requestAnimationFrame(loop);
})();

// Scroll-reveal animation
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const revealElements = document.querySelectorAll('section > div, article');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(function (el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(el);
  });
})();
