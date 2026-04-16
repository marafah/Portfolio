// ============================================================
// Portfolio — interactivity
// ============================================================
(function () {
  'use strict';

  const html = document.documentElement;

  /* ---------- Theme ---------- */
  const themeBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const setTheme = (t) => {
    html.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    themeIcon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  };
  const savedTheme = localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(savedTheme);
  themeBtn.addEventListener('click', () => {
    setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  /* ---------- Language + Typewriter state ---------- */
  const langBtn = document.getElementById('langToggle');
  const langLabel = document.getElementById('langLabel');
  const typeTarget = document.getElementById('typeTarget');

  const typePhrases = {
    en: [
      'Assistant Professor of Cybersecurity & AI',
      'AI Lead & Co-Founder @ Sygma',
      'Ph.D. · Loughborough University (UK)',
      'GAN Researcher · Anomaly Detection',
      'Peer Reviewer — Springer, Elsevier, Nature'
    ],
    ar: [
      'أستاذ مساعد في الأمن السيبراني والذكاء الاصطناعي',
      'رئيس قسم الذكاء الاصطناعي وشريك مؤسّس في Sygma',
      'دكتوراه من جامعة لوفبرا — المملكة المتحدة',
      'باحث في شبكات GAN وكشف الشذوذ',
      'مراجع علمي — Springer و Elsevier و Nature'
    ]
  };

  const savedLang = localStorage.getItem('lang') || 'en';
  const typeState = { lang: savedLang, i: 0, j: 0, deleting: false };

  const setLang = (lang) => {
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    localStorage.setItem('lang', lang);
    langLabel.textContent = lang === 'en' ? 'AR' : 'EN';

    document.querySelectorAll('[data-en]').forEach((el) => {
      const val = el.getAttribute(`data-${lang}`);
      if (val) el.textContent = val;
    });

    // reset typewriter
    typeState.lang = lang;
    typeState.i = 0;
    typeState.j = 0;
    typeState.deleting = false;
  };
  setLang(savedLang);
  langBtn.addEventListener('click', () => {
    setLang(html.getAttribute('lang') === 'en' ? 'ar' : 'en');
  });

  /* ---------- Typewriter ---------- */
  function tick() {
    const phrases = typePhrases[typeState.lang] || typePhrases.en;
    const full = phrases[typeState.i % phrases.length];
    if (!typeState.deleting) {
      typeState.j++;
      typeTarget.textContent = full.slice(0, typeState.j);
      if (typeState.j === full.length) {
        typeState.deleting = true;
        return setTimeout(tick, 1800);
      }
      return setTimeout(tick, 55);
    } else {
      typeState.j--;
      typeTarget.textContent = full.slice(0, typeState.j);
      if (typeState.j === 0) {
        typeState.deleting = false;
        typeState.i++;
        return setTimeout(tick, 400);
      }
      return setTimeout(tick, 30);
    }
  }
  tick();

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.getElementById('menuBtn');
  const navLinks = document.getElementById('navLinks');
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );

  /* ---------- Scroll progress + navbar state ---------- */
  const progress = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  const onScroll = () => {
    const s = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (s / h) * 100 + '%';
    toTop.classList.toggle('visible', s > 400);

    // active nav
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nav-links a').forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  toTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---------- Tabs ---------- */
  document.querySelectorAll('.tabs').forEach((tabsEl) => {
    const container = tabsEl.parentElement;
    const buttons = Array.from(tabsEl.querySelectorAll('.tab-btn'));
    const panels = buttons
      .map((b) => container.querySelector('#tab-' + b.getAttribute('data-tab')))
      .filter(Boolean);

    const activate = (btn) => {
      const target = btn.getAttribute('data-tab');
      buttons.forEach((b) => b.classList.toggle('active', b === btn));
      panels.forEach((p) => p.classList.toggle('active', p.id === 'tab-' + target));
      const active = panels.find((p) => p.id === 'tab-' + target);
      if (active) {
        active.querySelectorAll('.reveal').forEach((el) => el.classList.add('in'));
      }
    };

    buttons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        activate(btn);
      });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const revealSelectors = [
    '.section-head', '.about-card', '.info-card',
    '.tl-item', '.edu-card', '.pub-group', '.chip',
    '.train-card', '.skill-group', '.cert-card',
    '.project-card', '.contact-card', '.stat'
  ];
  revealSelectors.forEach((sel) =>
    document.querySelectorAll(sel).forEach((el) => el.classList.add('reveal'))
  );
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---------- Count-up for stats ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const runCount = (el) => {
    const target = parseInt(el.dataset.count || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    el.dataset.done = '1';
    const step = (t) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.floor(eased * target);
      el.textContent = val.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + suffix;
    };
    requestAnimationFrame(step);
  };
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || e.target.dataset.done) return;
      runCount(e.target);
      cio.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  counters.forEach((c) => {
    // show final value immediately as fallback, then animate when in view
    const target = parseInt(c.dataset.count || '0', 10);
    const suffix = c.dataset.suffix || '';
    c.textContent = target.toLocaleString() + suffix;
    // reset to 0 only if user hasn't scrolled past yet
    const rect = c.getBoundingClientRect();
    if (rect.top > window.innerHeight) c.textContent = '0' + suffix;
    cio.observe(c);
  });

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
})();
