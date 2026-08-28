/* ============================================================
   THE BRAIN COLLEGE BHAKKAR — Main JavaScript
   Animations, Scroll Reveal, Parallax, Magnetic Buttons
   ============================================================ */

'use strict';

function moveMarqueeAboveNavbar() {
  const navbar = document.querySelector('#navbar');
  if (!navbar) return;

  let marquee = document.querySelector('.announcement-bar');
  if (!marquee) {
    marquee = document.createElement('div');
    marquee.className = 'announcement-bar';
    marquee.innerHTML = `<div class="container-wide"><div class="marquee-track">
      <div class="marquee-item"><i class="fas fa-bullhorn"></i> Admissions Open 2026 — Apply Now!</div>
      <div class="marquee-item"><i class="fas fa-star"></i> New Batch Starting — Limited Seats Available</div>
      <div class="marquee-item"><i class="fas fa-graduation-cap"></i> MS Office, Computer Application, ACIT, Typing, Shorthand</div>
      <div class="marquee-item"><i class="fas fa-map-marker-alt"></i> Darya Khan Road, Bhakkar</div>
      <div class="marquee-item"><i class="fas fa-phone"></i> Call: 0333-8044574 | 0345-3994574</div>
      <div class="marquee-item"><i class="fas fa-certificate"></i> Nationally Certified Programs</div>
      <div class="marquee-item"><i class="fas fa-bullhorn"></i> Admissions Open 2026 — Apply Now!</div>
      <div class="marquee-item"><i class="fas fa-star"></i> New Batch Starting — Limited Seats Available</div>
      <div class="marquee-item"><i class="fas fa-graduation-cap"></i> MS Office, Computer Application, ACIT, Typing, Shorthand</div>
      <div class="marquee-item"><i class="fas fa-map-marker-alt"></i> Darya Khan Road, Bhakkar</div>
      <div class="marquee-item"><i class="fas fa-phone"></i> Call: 0333-8044574 | 0345-3994574</div>
      <div class="marquee-item"><i class="fas fa-certificate"></i> Nationally Certified Programs</div>
    </div></div>`;
  }

  document.body.classList.add('has-top-marquee');
  navbar.parentNode.insertBefore(marquee, navbar);
}

moveMarqueeAboveNavbar();

function initWelcomePopup() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/admin/') || /login\.html|signup\.html|get-started\.html$/.test(path)) return;
  if (localStorage.getItem('bc_welcome_seen') || (typeof BC_AUTH !== 'undefined' && BC_AUTH.isLoggedIn())) return;

  window.setTimeout(() => {
    if (localStorage.getItem('bc_welcome_seen')) return;
    const popup = document.createElement('div');
    popup.className = 'welcome-popup-overlay';
    popup.innerHTML = `
      <div class="welcome-popup" role="dialog" aria-modal="true" aria-labelledby="welcomePopupTitle">
        <button class="welcome-popup-close" type="button" aria-label="Close welcome dialog"><i class="fas fa-times"></i></button>
        <div class="welcome-popup-mark"><img src="images/logo.jpg" alt="The Brain College logo"></div>
        <span class="welcome-popup-kicker">Welcome to Brain College</span>
        <h2 id="welcomePopupTitle">Start your learning journey</h2>
        <p>Access your student portal or create an account to apply for our certified courses.</p>
        <div class="welcome-popup-actions">
          <a href="login.html" class="btn btn-primary"><i class="fas fa-sign-in-alt"></i> Login</a>
          <a href="signup.html" class="btn btn-accent"><i class="fas fa-user-plus"></i> Sign Up</a>
        </div>
        <button class="welcome-popup-continue" type="button">Continue browsing</button>
      </div>`;
    document.body.appendChild(popup);
    document.body.classList.add('welcome-popup-open');

    const closePopup = () => {
      localStorage.setItem('bc_welcome_seen', '1');
      popup.classList.add('closing');
      document.body.classList.remove('welcome-popup-open');
      window.setTimeout(() => popup.remove(), 250);
    };
    popup.querySelector('.welcome-popup-close').addEventListener('click', closePopup);
    popup.querySelector('.welcome-popup-continue').addEventListener('click', closePopup);
    popup.addEventListener('click', event => { if (event.target === popup) closePopup(); });
  }, 5000);
}

initWelcomePopup();

function escapeMediaText(value) {
  return String(value || '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

function injectUploadedMedia() {
  if (typeof BC_AUTH === 'undefined') return;

  const facultyGrid = document.querySelector('.faculty-grid');
  if (facultyGrid) {
    BC_AUTH.getMedia('faculty').forEach(item => {
      if (facultyGrid.querySelector(`[data-uploaded-media="${item.id}"]`)) return;
      const card = document.createElement('div');
      card.className = 'faculty-card uploaded-media-card';
      card.dataset.uploadedMedia = item.id;
      card.innerHTML = `<div class="faculty-image"><img src="${item.image}" alt="${escapeMediaText(item.name)}"></div><div class="faculty-body"><div class="faculty-name">${escapeMediaText(item.name)}</div><div class="faculty-designation">${escapeMediaText(item.designation)}</div></div>`;
      facultyGrid.appendChild(card);
    });
  }

  const galleryGrid = document.querySelector('#galleryGrid');
  if (galleryGrid) {
    BC_AUTH.getMedia('gallery').forEach(item => {
      if (galleryGrid.querySelector(`[data-uploaded-media="${item.id}"]`)) return;
      const card = document.createElement('div');
      card.className = 'gallery-item';
      card.dataset.category = item.category || 'college';
      card.dataset.uploadedMedia = item.id;
      card.innerHTML = `<img src="${item.image}" alt="${escapeMediaText(item.title)}"><div class="gallery-overlay"><i class="fas fa-expand"></i><span>${escapeMediaText(item.title)}</span></div>`;
      galleryGrid.appendChild(card);
    });
  }
}

injectUploadedMedia();

function initPageTransitions() {
  let transitionLayer = document.querySelector('.page-transition');
  if (!transitionLayer) {
    transitionLayer = document.createElement('div');
    transitionLayer.className = 'page-transition';
    document.body.appendChild(transitionLayer);
  }

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank') return;

    link.addEventListener('click', event => {
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin || destination.href === window.location.href) return;
      event.preventDefault();
      transitionLayer.classList.remove('leaving');
      transitionLayer.classList.add('entering');
      window.setTimeout(() => {
        transitionLayer.classList.remove('entering');
        transitionLayer.classList.add('leaving');
        window.location.href = destination.href;
      }, 180);
    });
  });
}

initPageTransitions();

/* ── Preloader ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 1600);
});

/* ── Navbar Scroll Effect ── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (navbar) {
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  document.body.classList.toggle('marquee-scrolled', currentScroll > 40);
  lastScroll = currentScroll;
}, { passive: true });

/* ── Mobile Navigation ── */
const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');
const mobileOverlay = document.querySelector('.mobile-overlay');
const mobileNavClose = document.querySelector('.mobile-nav-close');

function openMobileNav() {
  if (mobileNav) mobileNav.classList.add('open');
  if (mobileOverlay) mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (navToggle) navToggle.classList.add('active');
}

function closeMobileNav() {
  if (mobileNav) mobileNav.classList.remove('open');
  if (mobileOverlay) mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (navToggle) navToggle.classList.remove('active');
}

if (navToggle) navToggle.addEventListener('click', openMobileNav);
if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileNav);
if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

/* ── Active Nav Link ── */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNavLink();

/* ── Scroll Reveal ── */
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

/* ── Counter Animation ── */
function animateCounter(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  const isDecimal = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = start + (target - start) * eased;

    if (isDecimal) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current).toLocaleString();
    }

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statNumbers = document.querySelectorAll('.stat-number[data-count], .hero-stat-num[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseFloat(entry.target.dataset.count);
      const suffix = entry.target.dataset.suffix || '';
      const originalHTML = entry.target.innerHTML;
      const numSpan = document.createElement('span');
      entry.target.innerHTML = '';
      entry.target.appendChild(numSpan);
      if (suffix) {
        const sufSpan = document.createElement('span');
        sufSpan.className = 'stat-plus';
        sufSpan.textContent = suffix;
        entry.target.appendChild(sufSpan);
      }
      animateCounter(numSpan, target);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ── Parallax Effect ── */
function handleParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  const scrollY = window.scrollY;

  parallaxElements.forEach(el => {
    const speed = parseFloat(el.dataset.parallax) || 0.3;
    const rect = el.getBoundingClientRect();
    const elementCenter = rect.top + rect.height / 2;
    const windowCenter = window.innerHeight / 2;
    const offset = (elementCenter - windowCenter) * speed;
    el.style.transform = `translateY(${offset}px)`;
  });
}

window.addEventListener('scroll', handleParallax, { passive: true });

/* ── Magnetic Button Effect ── */
function initMagneticButtons() {
  const magneticBtns = document.querySelectorAll('.magnetic-wrap .btn');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const strength = 0.35;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.4,0,0.2,1)';
      setTimeout(() => { btn.style.transition = ''; }, 400);
    });
  });
}
initMagneticButtons();

/* ── Hero Particles ── */
function createHeroParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const colors = ['rgba(232,160,32,0.5)', 'rgba(255,255,255,0.3)', 'rgba(37,84,160,0.5)'];
  
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'hero-particle';
    const size = Math.random() * 4 + 2;
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 10 + 8}s;
      animation-delay: ${Math.random() * 8}s;
    `;
    hero.appendChild(particle);
  }
}
createHeroParticles();

/* ── Animated Text Typing ── */
function initTypingEffect() {
  const typingEl = document.querySelector('[data-typing]');
  if (!typingEl) return;

  const words = JSON.parse(typingEl.dataset.typing);
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];

    if (!isDeleting) {
      typingEl.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      typingEl.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }
    setTimeout(type, isDeleting ? 60 : 100);
  }
  type();
}
initTypingEffect();

function initHeroTypewriter() {
  const title = document.querySelector('[data-typing-text]');
  if (!title) return;

  const text = title.dataset.typingText;
  let position = 0;
  let deleting = false;

  const type = () => {
    title.textContent = text.slice(0, position);
    if (!deleting && position < text.length) {
      position += 1;
      window.setTimeout(type, 150);
    } else if (!deleting) {
      deleting = true;
      window.setTimeout(type, 2600);
    } else if (position > 0) {
      position -= 1;
      window.setTimeout(type, 90);
    } else {
      deleting = false;
      window.setTimeout(type, 700);
    }
  };

  type();
}

initHeroTypewriter();

/* ── Smooth Scroll for Anchor Links ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 20;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Hero Scroll Indicator ── */
const heroScroll = document.querySelector('.hero-scroll');
if (heroScroll) {
  heroScroll.addEventListener('click', () => {
    const nextSection = document.querySelector('.announcement-bar') || document.querySelector('section:nth-of-type(2)');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ── Gallery Filter ── */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      galleryItems.forEach((item, i) => {
        const cat = item.dataset.category;
        const show = filter === 'all' || cat === filter;
        item.style.transition = `opacity 0.4s ease ${i * 0.03}s, transform 0.4s ease ${i * 0.03}s`;
        if (show) {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
          item.style.display = '';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            if (btn.dataset.filter !== filter || filter !== 'all') {
              // keep in flow but hidden
            }
          }, 400);
        }
      });
    });
  });
}
initGalleryFilter();

/* ── Admission Form Multi-Step ── */
function initAdmissionForm() {
  const form = document.getElementById('admissionForm');
  if (!form) return;

  const steps = document.querySelectorAll('.form-step-section');
  const stepIndicators = document.querySelectorAll('.form-step');
  const nextBtns = document.querySelectorAll('[data-next]');
  const prevBtns = document.querySelectorAll('[data-prev]');
  let currentStep = 0;

  function showStep(index) {
    steps.forEach((step, i) => {
      step.style.display = i === index ? 'block' : 'none';
    });
    stepIndicators.forEach((ind, i) => {
      ind.classList.toggle('active', i === index);
      ind.classList.toggle('completed', i < index);
    });
    currentStep = index;
  }

  showStep(0);

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) showStep(currentStep + 1);
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) showStep(currentStep - 1);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameEl = document.getElementById('fname');
    const name = nameEl ? nameEl.value : 'Student';
    const id = 'BRAIN-2026-' + String(Math.floor(Math.random() * 90000) + 10000);
    const idEl = document.getElementById('applicationId');
    const nameDisplay = document.getElementById('applicantName');
    if (idEl) idEl.textContent = id;
    if (nameDisplay) nameDisplay.textContent = name;
    form.closest('.form-card').style.display = 'none';
    const success = document.getElementById('appSuccess');
    if (success) {
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}
initAdmissionForm();

/* ── Admission Status Checker ── */
function initStatusChecker() {
  const checkBtn = document.getElementById('checkStatusBtn');
  if (!checkBtn) return;

  // Demo data
  const demoApplications = {
    'BRAIN-2026-10125': { name: 'Muhammad Ali', father: 'Ali Hassan', course: 'Computer Application', date: '25 Aug 2026', status: 'approved', phone: '0333-1234567' },
    'BRAIN-2026-20200': { name: 'Ahmad Raza', father: 'Raza Khan', course: 'MS Office', date: '26 Aug 2026', status: 'pending', phone: '0345-9876543' },
    'BRAIN-2026-30088': { name: 'Fatima Tariq', father: 'Tariq Mehmood', course: 'Typing English & Urdu', date: '24 Aug 2026', status: 'review', phone: '0333-5556677' },
    'BRAIN-2026-40301': { name: 'Usman Ali', father: 'Ali Bux', course: 'Shorthand', date: '22 Aug 2026', status: 'enrolled', phone: '0345-1112233' },
  };

  checkBtn.addEventListener('click', () => {
    const appId = document.getElementById('appIdInput')?.value?.trim().toUpperCase();
    const phone = document.getElementById('phoneInput')?.value?.trim();
    const result = document.getElementById('statusResult');
    const notFound = document.getElementById('statusNotFound');

    if (!appId) return;

    const app = demoApplications[appId];

    if (result) result.style.display = 'none';
    if (notFound) notFound.style.display = 'none';

    if (app) {
      if (result) {
        result.style.display = 'block';
        result.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const statusMap = {
          pending: { text: '🟡 Pending', cls: 'status-pending' },
          approved: { text: '🟢 Approved', cls: 'status-approved' },
          rejected: { text: '🔴 Rejected', cls: 'status-rejected' },
          review: { text: '🔵 Under Review', cls: 'status-review' },
          enrolled: { text: '⚫ Enrolled', cls: 'status-enrolled' },
        };
        const s = statusMap[app.status];
        const badge = result.querySelector('.status-badge-large');
        if (badge) { badge.textContent = s.text; badge.className = 'status-badge-large ' + s.cls; }
        const fields = { 'res-id': appId, 'res-name': app.name, 'res-father': app.father, 'res-course': app.course, 'res-phone': app.phone, 'res-date': app.date };
        Object.entries(fields).forEach(([id, val]) => {
          const el = document.getElementById(id);
          if (el) el.textContent = val;
        });
      }
    } else {
      if (notFound) notFound.style.display = 'block';
    }
  });
}
initStatusChecker();

/* ── Contact Form ── */
function initContactForm() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    btn.disabled = true;
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });
}
initContactForm();

/* ── Cursor Trail Effect (subtle) ── */
function initCursorTrail() {
  if (window.matchMedia('(max-width: 768px)').matches) return;
  
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: rgba(26,60,110,0.6);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    transition: transform 0.1s ease;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(cursor);

  const cursorOuter = document.createElement('div');
  cursorOuter.style.cssText = `
    position: fixed;
    width: 36px;
    height: 36px;
    border: 1.5px solid rgba(26,60,110,0.25);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    transition: all 0.15s ease;
  `;
  document.body.appendChild(cursorOuter);

  let mouseX = 0, mouseY = 0;
  let outerX = 0, outerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX - 4 + 'px';
    cursor.style.top = mouseY - 4 + 'px';
  });

  function updateOuter() {
    outerX += (mouseX - outerX) * 0.12;
    outerY += (mouseY - outerY) * 0.12;
    cursorOuter.style.left = outerX - 18 + 'px';
    cursorOuter.style.top = outerY - 18 + 'px';
    requestAnimationFrame(updateOuter);
  }
  updateOuter();

  document.querySelectorAll('a, button, .course-card, .faculty-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursorOuter.style.transform = 'scale(1.5)';
      cursorOuter.style.borderColor = 'rgba(232,160,32,0.5)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = '';
      cursorOuter.style.transform = '';
      cursorOuter.style.borderColor = '';
    });
  });
}
initCursorTrail();

/* ── Stagger Animation for cards ── */
function staggerCards() {
  const grids = document.querySelectorAll('.courses-grid, .faculty-grid, .testimonials-grid, .news-grid, .facilities-grid');
  
  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll('.course-card, .faculty-card, .testimonial-card, .news-card, .facility-card');
        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(30px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.4,0,0.2,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 100);
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  grids.forEach(g => staggerObserver.observe(g));
}
staggerCards();

/* ── Navbar transparent on hero — REMOVED, navbar always white ── */
function initHeroNavbar() {
  // Navbar is always white — no color overrides needed
}

/* ── Copy Application ID ── */
const copyBtn = document.getElementById('copyAppId');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const id = document.getElementById('applicationId')?.textContent;
    if (id) {
      navigator.clipboard.writeText(id);
      const original = copyBtn.innerHTML;
      copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => { copyBtn.innerHTML = original; }, 2000);
    }
  });
}


/* ============================================================
   CINEMATIC HERO ENHANCEMENTS
   ============================================================ */

/* ── Dynamic Particle Field ── */
function createParticleField() {
  const hero = document.querySelector('.hero-cinematic');
  if (!hero) return;

  const field = document.createElement('div');
  field.className = 'particle-field';
  hero.appendChild(field);

  const colors = [
    'rgba(232,160,32,0.6)',
    'rgba(255,255,255,0.25)',
    'rgba(37,84,160,0.5)',
    'rgba(245,188,80,0.4)',
  ];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay = Math.random() * 10;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: 0;
      background: ${color};
      border-radius: 50%;
      animation-name: particle-rise;
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    `;
    field.appendChild(p);
  }
}
createParticleField();

/* ── Hero Title Word-by-Word Animation ── */
function animateHeroWords() {
  const title = document.querySelector('.hero-title-animate');
  if (!title) return;
  // Already handled by CSS animation — just ensure it's visible
  title.style.willChange = 'opacity, transform';
}
animateHeroWords();

/* ── Cinematic text shimmer on hover ── */
function initTextShimmer() {
  const shimmerElements = document.querySelectorAll('.hero-text-glow');
  shimmerElements.forEach(el => {
    el.style.backgroundSize = '200% auto';
    el.addEventListener('mouseenter', () => {
      el.style.transition = 'background-position 0.8s ease';
      el.style.backgroundPosition = 'right center';
    });
    el.addEventListener('mouseleave', () => {
      el.style.backgroundPosition = 'left center';
    });
  });
}
initTextShimmer();

/* ── Hero illustration parallax on mouse move ── */
function initHeroMouseParallax() {
  const hero = document.querySelector('.hero-cinematic');
  const img = document.querySelector('.hero-illustration-img');
  const floats = document.querySelectorAll('.hero-float-animate-1, .hero-float-animate-2');
  if (!hero || !img) return;

  hero.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 1024) return;
    const rect = hero.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    img.style.transform = `translateY(-12px) perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;

    floats.forEach((f, i) => {
      const depth = i === 0 ? 1.5 : -1.2;
      f.style.transform = `translate(${dx * depth * 12}px, ${dy * depth * 8}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    img.style.transform = '';
    img.style.transition = 'transform 0.8s cubic-bezier(0.4,0,0.2,1)';
    floats.forEach(f => {
      f.style.transform = '';
      f.style.transition = 'transform 0.8s ease';
    });
    setTimeout(() => {
      img.style.transition = '';
      floats.forEach(f => f.style.transition = '');
    }, 800);
  });
}
initHeroMouseParallax();

/* ── Staggered number counter for hero stats ── */
function initHeroStatsCounter() {
  const stats = document.querySelectorAll('.hero-stats-animate .hero-stat-num[data-count]');
  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        stats.forEach((el, i) => {
          setTimeout(() => {
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            el.textContent = '0' + suffix;

            let start = null;
            const duration = 1800;
            function step(timestamp) {
              if (!start) start = timestamp;
              const progress = Math.min((timestamp - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 4);
              const val = Math.floor(target * eased);
              el.textContent = val.toLocaleString() + suffix;
              if (progress < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
          }, i * 150);
        });
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}
initHeroStatsCounter();

/* ── CTA button ripple effect ── */
function initButtonRipple() {
  document.querySelectorAll('.hero-cta-primary, .btn-primary, .btn-accent').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255,255,255,0.25);
        left: ${x}px;
        top: ${y}px;
        transform: scale(0);
        animation: ripple-expand 0.55s ease-out forwards;
        pointer-events: none;
      `;

      if (!document.getElementById('rippleStyle')) {
        const style = document.createElement('style');
        style.id = 'rippleStyle';
        style.textContent = '@keyframes ripple-expand { to { transform: scale(2.5); opacity: 0; } }';
        document.head.appendChild(style);
      }

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}
initButtonRipple();
