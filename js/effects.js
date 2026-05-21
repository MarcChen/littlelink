/* ============================================
   LittleLink Effects — Particles, Cursor Glow
   Vanilla JS, no dependencies
   ============================================ */
(function () {
  'use strict';

  /* ── Respect reduced-motion preference ───── */
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Stagger Index Injection ─────────────── */
  function injectStaggerIndices() {
    const buttons = document.querySelectorAll('.button-stack .button');
    buttons.forEach(function (btn, i) {
      btn.style.setProperty('--i', i);
    });
  }

  /* ── Floating Particles ──────────────────── */
  function initParticles() {
    if (prefersReducedMotion) return;

    var canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var PARTICLE_COUNT = 45;
    var animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.8 + 0.4,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.25 + 0.08,
        // Subtle color variation: blue-ish to violet-ish
        hue: 230 + Math.random() * 40,
      };
    }

    function init() {
      resize();
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          'hsla(' + p.hue + ', 70%, 75%, ' + p.opacity + ')';
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();

    // Cleanup on page hide (battery saving)
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }

  /* ── Cursor Glow ─────────────────────────── */
  function initCursorGlow() {
    if (prefersReducedMotion) return;

    var glow = document.querySelector('.cursor-glow');
    if (!glow) return;

    // Disable on touch-primary devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      glow.style.display = 'none';
      return;
    }

    var mouseX = -500;
    var mouseY = -500;
    var currentX = -500;
    var currentY = -500;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      glow.classList.add('active');
    });

    document.addEventListener('mouseleave', function () {
      glow.classList.remove('active');
    });

    function update() {
      // Smooth interpolation (lerp)
      currentX += (mouseX - currentX) * 0.08;
      currentY += (mouseY - currentY) * 0.08;
      glow.style.left = currentX + 'px';
      glow.style.top = currentY + 'px';
      requestAnimationFrame(update);
    }

    update();
  }

  /* ── Initialize Everything ───────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    injectStaggerIndices();
    initParticles();
    initCursorGlow();
  });
})();
