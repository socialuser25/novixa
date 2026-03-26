/**
 * Navixa Education — Main JavaScript
 * Handles: Nav, Animations, Counter, FAQ, Forms, Scroll effects
 */

'use strict';

/* ———— DOM Ready ———— */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initScrollReveal();
  initCounterAnimation();
  initFAQ();
  initForms();
  initStickyWhatsApp();
});

/* ———— HEADER: Scroll effect ———— */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });
}

/* ———— MOBILE NAV ———— */
function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const nav = document.querySelector('.nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });
}

/* ———— SCROLL REVEAL ———— */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.feature-card, .service-card, .country-card, .testimonial-card, .blog-card, .process-step, .contact-item, .visa-step, .team-card, .cost-card'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('reveal', 'visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  } else {
    elements.forEach(el => el.classList.add('reveal', 'visible'));
  }
}

/* ———— COUNTER ANIMATION ———— */
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '+';
        animateCounter(el, target, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target, suffix = '+') {
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 16);
}

/* ———— FAQ ACCORDION ———— */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i => i.classList.remove('open'));
      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ———— FORMS ———— */
function initForms() {
  const forms = document.querySelectorAll('.contact-form, #contact-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleFormSubmit(form);
    });
  });
}

function handleFormSubmit(form) {
  // Basic validation
  const required = form.querySelectorAll('[required]');
  let valid = true;

  required.forEach(field => {
    field.classList.remove('error');
    if (!field.value.trim()) {
      field.classList.add('error');
      field.style.borderColor = '#ef4444';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });

  if (!valid) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Simulate submission (replace with actual API)
  const submitBtn = form.querySelector('[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = '⏳ Sending...';
  submitBtn.disabled = true;

  // Build WhatsApp message from form data
  const name = form.querySelector('[name="name"]')?.value || '';
  const phone = form.querySelector('[name="phone"]')?.value || '';
  const country = form.querySelector('[name="country"]')?.value || '';
  const message = form.querySelector('[name="message"]')?.value || '';

  setTimeout(() => {
    // Show success state
    const successDiv = form.querySelector('.form-success');
    if (successDiv) {
      form.reset();
      successDiv.classList.add('show');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } else {
      showToast('✅ Thank you! We\'ll contact you within 2 hours.', 'success');
      form.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }

    // Also open WhatsApp with pre-filled message
    const waMsg = encodeURIComponent(
      `Hello Navixa Education! 👋\n\nName: ${name}\nPhone: ${phone}\nDestination: ${country}\n\n${message}`
    );
    // Don't auto-open, just prepare
  }, 1200);
}

/* ———— TOAST NOTIFICATIONS ———— */
function showToast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? '#16a34a' : type === 'error' ? '#dc2626' : '#1a56db'};
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
    z-index: 9999;
    transition: all 0.3s ease;
    opacity: 0;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ———— STICKY WHATSAPP: Show after scroll ———— */
function initStickyWhatsApp() {
  const btn = document.getElementById('sticky-whatsapp-btn');
  if (!btn) return;

  // Start hidden, show after 3 seconds or scroll
  btn.style.opacity = '0';
  btn.style.transform = 'scale(0.8) translateY(20px)';
  btn.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

  function showBtn() {
    btn.style.opacity = '1';
    btn.style.transform = 'scale(1) translateY(0)';
  }

  // Show on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) showBtn();
  }, { passive: true });

  // Show after 3s regardless
  setTimeout(showBtn, 3000);
}

/* ———— SMOOTH SCROLL for anchor links ———— */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerHeight = document.getElementById('header')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ———— ACTIVE NAV state based on current page ———— */
function setActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}
setActiveNav();

/* ———— IMAGE LAZY LOAD fallback ———— */
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
  img.addEventListener('error', () => {
    // Graceful fallback for missing images
    const parent = img.parentElement;
    if (parent && parent.classList.contains('blog-image')) {
      img.style.opacity = '0';
    }
  });
});
