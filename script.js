/* ============================================================
   MANIRATHINAM — Portfolio JavaScript
   Features: Cursor, Particles, Typed text, Counter animation,
   Scroll reveal, Nav scroll state, Tilt cards, Form handler,
   Active nav highlight, Progress bar, Theme transitions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. CUSTOM CURSOR
  ───────────────────────────────────────── */
  const cursor     = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Lag ring for smooth trailing
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .skill-card, .project-card, label').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      cursorRing.classList.remove('hovering');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorRing.style.opacity = '1';
  });


  /* ─────────────────────────────────────────
     2. EMBER PARTICLE SYSTEM
  ───────────────────────────────────────── */
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const COLORS = ['#e8c55a', '#d4580a', '#b8860b', '#f07030', '#fce4b0', '#c44b08'];
  const particles = Array.from({ length: 60 }, () => createParticle(true));

  function createParticle(randomY = false) {
    return {
      x:    Math.random() * window.innerWidth,
      y:    randomY ? Math.random() * window.innerHeight : window.innerHeight + 10,
      size: Math.random() * 2.4 + 0.5,
      speedY: Math.random() * 0.7 + 0.2,
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.4 + 0.05,
      decay:   0.0005 + Math.random() * 0.0008,
      color:   COLORS[Math.floor(Math.random() * COLORS.length)],
    };
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle   = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur  = 7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      p.y -= p.speedY;
      p.x += p.speedX;
      p.opacity -= p.decay;

      if (p.y < -10 || p.opacity <= 0) {
        particles[i] = createParticle(false);
      }
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();


  /* ─────────────────────────────────────────
     3. TYPED TEXT EFFECT (hero tagline)
  ───────────────────────────────────────── */
  const typedEl = document.getElementById('typed-tagline');
  if (typedEl) {
    const lines = [
      'Turning complexity into clarity — one dataset at a time.',
      'Building intelligence systems that drive real decisions.',
      'Where data strategy meets business impact.',
    ];
    let lineIdx = 0, charIdx = 0, deleting = false, pause = 0;

    function typeLoop() {
      const current = lines[lineIdx];
      if (pause > 0) { pause--; setTimeout(typeLoop, 40); return; }

      if (!deleting) {
        typedEl.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) { deleting = true; pause = 60; }
        setTimeout(typeLoop, 48);
      } else {
        typedEl.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) { deleting = false; lineIdx = (lineIdx + 1) % lines.length; pause = 10; }
        setTimeout(typeLoop, 22);
      }
    }
    setTimeout(typeLoop, 1400);
  }


  /* ─────────────────────────────────────────
     4. COUNTER ANIMATION
  ───────────────────────────────────────── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '+';
    const duration = 1600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  /* ─────────────────────────────────────────
     5. SCROLL REVEAL + SKILL BARS + COUNTERS
  ───────────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = el.dataset.delay || i * 80;

      setTimeout(() => {
        el.classList.add('visible');

        // Trigger skill bars inside this element
        el.querySelectorAll('.skill-bar').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });

        // Trigger counters inside this element
        el.querySelectorAll('[data-target]').forEach(animateCounter);

      }, parseInt(delay));

      revealObserver.unobserve(el);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal, .stagger').forEach(el => revealObserver.observe(el));

  // Stats band counters (separate observer for the band)
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
      statsObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  const statsBand = document.querySelector('.stats-band');
  if (statsBand) statsObserver.observe(statsBand);


  /* ─────────────────────────────────────────
     6. NAV SCROLL STATE + ACTIVE LINK
  ───────────────────────────────────────── */
  const nav = document.querySelector('nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNav() {
    const y = window.scrollY;

    // Scrolled state
    if (y > 60) nav.classList.add('scrolled');
    else         nav.classList.remove('scrolled');

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();


  /* ─────────────────────────────────────────
     7. SCROLL PROGRESS BAR
  ───────────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      progressBar.style.width = (window.scrollY / docH * 100) + '%';
    }, { passive: true });
  }


  /* ─────────────────────────────────────────
     8. CARD TILT EFFECT
  ───────────────────────────────────────── */
  document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ─────────────────────────────────────────
     9. SMOOTH SCROLL FOR NAV LINKS
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     10. CONTACT FORM
  ───────────────────────────────────────── */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✓ Message sent — I\'ll get back to you soon!');
      form.reset();
    });
  }

  document.getElementById('cv-btn')?.addEventListener('click', e => {
    e.preventDefault();
    showToast('⬇ Resume download initiated');
  });


  /* ─────────────────────────────────────────
     11. TOAST NOTIFICATION
  ───────────────────────────────────────── */
  function showToast(msg, duration = 3500) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), duration);
  }


  /* ─────────────────────────────────────────
     12. YEAR IN FOOTER
  ───────────────────────────────────────── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
