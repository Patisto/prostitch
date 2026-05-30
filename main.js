/**
 * ProStitch Uniforms — Main JavaScript
 * Limbe, Blantyre, Malawi
 */

'use strict';

// ============================================================
// AOS (Animate on Scroll)
// ============================================================
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 750,
    easing: 'ease-in-out',
    once: true,
    offset: 60
  });
}

window.addEventListener('load', function () {
  if (typeof AOS !== 'undefined') AOS.refresh();
});

// ============================================================
// DOM Ready
// ============================================================
document.addEventListener('DOMContentLoaded', function () {
  initPreloader();
  initStickyHeader();
  initBackToTop();
  initMobileMenu();
  initHeroSlider();
  initTestimonialSlider();
  initCounterAnimation();
  initContactForm();
  initSmoothScroll();
  initNavActiveLink();
});

// ============================================================
// PRELOADER
// ============================================================
function initPreloader() {
  var preloader = document.getElementById('preloader-active');
  if (!preloader) return;

  window.addEventListener('load', function () {
    setTimeout(function () {
      preloader.style.transition = 'opacity 0.6s ease';
      preloader.style.opacity = '0';
      setTimeout(function () {
        preloader.style.display = 'none';
        document.body.style.overflow = 'visible';
      }, 600);
    }, 400);
  });
}

// ============================================================
// STICKY HEADER
// ============================================================
function initStickyHeader() {
  var header = document.querySelector('.header-sticky');
  var backTop = document.getElementById('back-top');
  if (!header) return;

  function onScroll() {
    var scrollY = window.pageYOffset;
    if (scrollY > 120) {
      header.classList.add('sticky-bar');
      if (backTop) backTop.style.display = 'block';
    } else {
      header.classList.remove('sticky-bar');
      if (backTop) backTop.style.display = 'none';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ============================================================
// BACK TO TOP
// ============================================================
function initBackToTop() {
  var btn = document.getElementById('back-top');
  if (!btn) return;
  var link = btn.querySelector('a');
  if (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// ============================================================
// MOBILE MENU
// ============================================================
function initMobileMenu() {
  var container = document.querySelector('.mobile_menu');
  var nav = document.getElementById('navigation');
  if (!container || !nav) return;

  // Build mobile nav
  var wrap = document.createElement('div');
  wrap.className = 'slicknav_menu';

  var btn = document.createElement('button');
  btn.className = 'slicknav_btn';
  btn.setAttribute('aria-label', 'Toggle navigation');
  btn.innerHTML = '<span class="slicknav_icon"><span class="slicknav_icon-bar"></span><span class="slicknav_icon-bar"></span><span class="slicknav_icon-bar"></span></span>';

  var clone = nav.cloneNode(true);
  clone.id = 'navigation-mobile';
  clone.className = 'slicknav_nav slicknav_hidden';

  // Submenu toggles
  clone.querySelectorAll('.submenu').forEach(function (sub) {
    var parent = sub.parentElement;
    var arrow = document.createElement('span');
    arrow.className = 'slicknav_arrow';
    arrow.textContent = '+';

    var parentLink = parent.querySelector(':scope > a');
    if (parentLink) parentLink.insertAdjacentElement('afterend', arrow);
    sub.style.display = 'none';

    arrow.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var open = sub.style.display === 'block';
      sub.style.display = open ? 'none' : 'block';
      arrow.textContent = open ? '+' : '−';
    });
  });

  wrap.appendChild(btn);
  wrap.appendChild(clone);
  container.appendChild(wrap);

  btn.addEventListener('click', function () {
    clone.classList.toggle('slicknav_hidden');
    clone.classList.toggle('slicknav_open');
    btn.classList.toggle('slicknav_open');
  });

  // Close mobile nav when a link is clicked
  clone.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      clone.classList.add('slicknav_hidden');
      clone.classList.remove('slicknav_open');
      btn.classList.remove('slicknav_open');
    });
  });
}

// ============================================================
// HERO SLIDER (Swiper)
// ============================================================
function initHeroSlider() {
  var el = document.querySelector('.slider-active');
  if (!el || typeof Swiper === 'undefined') return;

  var heroSwiper = new Swiper('.slider-active', {
    slidesPerView: 1,
    loop: true,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 900,
    autoplay: {
      delay: 5500,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.slider-area .swiper-button-next',
      prevEl: '.slider-area .swiper-button-prev'
    },
    on: {
      init: function () {
        triggerSlideAnimations(this.slides[this.activeIndex]);
      },
      slideChange: function () {
        triggerSlideAnimations(this.slides[this.activeIndex]);
      }
    }
  });
}

function triggerSlideAnimations(slide) {
  if (!slide) return;
  var els = slide.querySelectorAll('[data-animation]');
  els.forEach(function (el) {
    var anim = el.getAttribute('data-animation');
    var delay = el.getAttribute('data-delay') || '0s';
    el.classList.remove('animated', anim);
    setTimeout(function () {
      el.style.animationDelay = delay;
      el.classList.add('animated', anim);
    }, 80);
  });
}

// ============================================================
// TESTIMONIAL SLIDER (Swiper)
// ============================================================
function initTestimonialSlider() {
  var el = document.querySelector('.testimonial-swiper');
  if (!el || typeof Swiper === 'undefined') return;

  new Swiper('.testimonial-swiper', {
    slidesPerView: 1,
    loop: true,
    speed: 800,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false
    },
    navigation: {
      nextEl: '.testimonial-swiper .swiper-button-next',
      prevEl: '.testimonial-swiper .swiper-button-prev'
    },
    pagination: {
      el: '.testimonial-swiper .swiper-pagination',
      clickable: true
    }
  });
}

// ============================================================
// COUNTER ANIMATION
// ============================================================
function initCounterAnimation() {
  var counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(function (c) { observer.observe(c); });
}

function animateCounter(el) {
  var target = parseInt(el.textContent, 10) || 0;
  var duration = 1800;
  var start = null;

  function step(ts) {
    if (!start) start = ts;
    var progress = Math.min((ts - start) / duration, 1);
    // Ease out cubic
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        var headerH = document.querySelector('.header-bottom') ? 80 : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerH;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });
}

// ============================================================
// ACTIVE NAV LINK ON SCROLL
// ============================================================
function initNavActiveLink() {
  var sections = document.querySelectorAll('section[id], div[id]');
  var navLinks = document.querySelectorAll('.main-menu nav ul > li > a');

  function setActive() {
    var scrollY = window.pageYOffset + 100;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var bottom = top + section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', setActive, { passive: true });
}

// ============================================================
// CONTACT FORM
// ============================================================
function initContactForm() {
  var form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('button[type="submit"]');
    var name = form.querySelector('#name');
    var email = form.querySelector('#email');
    var message = form.querySelector('#message');

    // Simple validation
    var errors = [];
    if (!name || !name.value.trim()) errors.push('Name is required.');
    if (!email || !email.value.trim()) errors.push('Email is required.');
    if (email && !validateEmail(email.value)) errors.push('Please enter a valid email.');
    if (!message || !message.value.trim()) errors.push('Please tell us what you need.');

    if (errors.length) {
      showMsg(form, errors.join(' '), 'error');
      return;
    }

    var orig = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Simulate submission (replace with real fetch to your backend)
    setTimeout(function () {
      showMsg(form, 'Thank you! We\'ll be in touch within 24 hours.', 'success');
      form.reset();
      btn.disabled = false;
      btn.textContent = orig;
    }, 1200);
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMsg(form, msg, type) {
  var old = form.querySelector('.form-message');
  if (old) old.remove();

  var el = document.createElement('div');
  el.className = 'form-message alert alert-' + (type === 'success' ? 'success' : 'danger');
  el.textContent = msg;

  var btn = form.querySelector('button[type="submit"]');
  if (btn && btn.parentNode) btn.parentNode.appendChild(el);

  setTimeout(function () { if (el.parentNode) el.remove(); }, 6000);
}
