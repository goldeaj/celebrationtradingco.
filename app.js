/* ============================================
   CELEBRATION TRADING CO. — JAVASCRIPT
   Animations, interactions, counters
   ============================================ */

/* ---------- NAVBAR SCROLL ---------- */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  if (scrollY > 30) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScrollY = scrollY;
}, { passive: true });


/* ---------- HAMBURGER / MOBILE MENU ---------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function closeMobileMenu() {
  menuOpen = false;
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  menuOpen = !menuOpen;
  hamburger.classList.toggle('open', menuOpen);
  mobileMenu.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    closeMobileMenu();
  }
});


/* ---------- SCROLL ANIMATION OBSERVER ---------- */
const animateEls = document.querySelectorAll('[data-animate]');

const animateObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('in-view');
      }, delay);
      animateObserver.unobserve(el);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

animateEls.forEach(el => animateObserver.observe(el));


/* ---------- COUNTER ANIMATION ---------- */
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const isLarge = target >= 1000;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    if (isLarge) {
      el.textContent = current.toLocaleString();
    } else {
      el.textContent = current;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (isLarge) {
        el.textContent = target.toLocaleString();
      } else {
        el.textContent = target;
      }
    }
  }

  requestAnimationFrame(update);
}

// Observe hero stats section
const heroStats = document.querySelector('.hero-stats');
const statNumbers = document.querySelectorAll('.stat-number[data-count]');
let countersStarted = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      statNumbers.forEach(el => {
        const target = parseInt(el.dataset.count);
        animateCounter(el, target);
      });
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

if (heroStats) statsObserver.observe(heroStats);


/* ---------- TICKER PAUSE ON HOVER ---------- */
const tickerTrack = document.querySelector('.ticker-track');
if (tickerTrack) {
  tickerTrack.addEventListener('mouseenter', () => {
    tickerTrack.style.animationPlayState = 'paused';
  });
  tickerTrack.addEventListener('mouseleave', () => {
    tickerTrack.style.animationPlayState = 'running';
  });
}

const brandsTrack = document.querySelector('.brands-track');
if (brandsTrack) {
  brandsTrack.addEventListener('mouseenter', () => {
    brandsTrack.style.animationPlayState = 'paused';
  });
  brandsTrack.addEventListener('mouseleave', () => {
    brandsTrack.style.animationPlayState = 'running';
  });
}


/* ---------- CONTACT FORM ---------- */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitText');
  const successMsg = document.getElementById('formSuccess');
  const form = document.getElementById('contactForm');

  btn.textContent = 'Sending...';

  // Simulate form submission
  setTimeout(() => {
    btn.textContent = 'Sent!';
    successMsg.style.display = 'block';

    // Reset after 4 seconds
    setTimeout(() => {
      form.reset();
      btn.textContent = 'Send Inquiry';
      successMsg.style.display = 'none';
    }, 4000);
  }, 1200);
}


/* ---------- SMOOTH NAV LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ---------- ACTIVE NAV HIGHLIGHT ---------- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, {
  threshold: 0.35,
  rootMargin: '-60px 0px -40% 0px'
});

sections.forEach(section => sectionObserver.observe(section));


/* ---------- CARD TILT EFFECT ---------- */
document.querySelectorAll('.product-card, .why-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const tiltX = y * 6;
    const tiltY = -x * 6;
    card.style.transform = `translateY(-4px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, border-color 0.3s, background 0.3s, box-shadow 0.3s';
  });
});


/* ---------- PARALLAX HERO ---------- */
const heroBgImage = document.querySelector('.hero-bg-image');
window.addEventListener('scroll', () => {
  if (heroBgImage) {
    const scrolled = window.scrollY;
    const rate = scrolled * 0.3;
    heroBgImage.style.transform = `scale(1.05) translateY(${rate}px)`;
  }
}, { passive: true });


/* ---------- PAGE LOAD ANIMATION ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Stagger hero elements in
  const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-actions, .hero-stats');
  heroElements.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.8s ease, transform 0.8s ease`;
    el.style.transitionDelay = `${i * 120}ms`;

    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100 + i * 120);
  });
});


/* ---------- ACTIVE NAV LINK STYLE ---------- */
const style = document.createElement('style');
style.textContent = `
  .nav-link.active {
    color: var(--accent) !important;
    background: var(--accent-dim) !important;
  }
`;
document.head.appendChild(style);


/* ---------- WHATSAPP PULSE ---------- */
const waBtn = document.querySelector('.whatsapp-btn');
if (waBtn) {
  setInterval(() => {
    waBtn.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.7), 0 0 0 8px rgba(37,211,102,0.15)';
    setTimeout(() => {
      waBtn.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
    }, 600);
  }, 3000);
}
