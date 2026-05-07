// =============================================
// INITIALIZATION & GLOBALS
// =============================================
gsap.registerPlugin(ScrollTrigger);

let lenis;
let mouseX = 0,
  mouseY = 0;
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const mouseGlow = document.getElementById('mouseGlow');

// =============================================
// LENIS SMOOTH SCROLL
// =============================================
function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
    smoothTouch: false,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add(time => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// =============================================
// CUSTOM CURSOR
// =============================================
function initCursor() {
  if (window.innerWidth < 1024) return;

  // Trail particles
  const trails = [];
  for (let i = 0; i < 6; i++) {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    document.body.appendChild(trail);
    trails.push({ el: trail, x: 0, y: 0 });
  }

  let trailPositions = [];

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trailPositions.unshift({ x: mouseX, y: mouseY });
    if (trailPositions.length > 12) trailPositions.pop();
  });

  function animateCursor() {
    // Dot
    gsap.to(cursorDot, {
      x: mouseX - 4,
      y: mouseY - 4,
      duration: 0.1,
      ease: 'power2.out',
    });

    // Ring
    gsap.to(cursorRing, {
      x: mouseX - 20,
      y: mouseY - 20,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Glow
    gsap.to(mouseGlow, {
      x: mouseX,
      y: mouseY,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Trails
    trails.forEach((trail, i) => {
      const pos = trailPositions[i * 2] || { x: mouseX, y: mouseY };
      gsap.to(trail.el, {
        x: pos.x - 2,
        y: pos.y - 2,
        duration: 0.4 + i * 0.08,
        ease: 'power2.out',
        opacity: 0.3 - i * 0.05,
      });
    });

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects
  const hoverTargets = document.querySelectorAll(
    'a, button, .glass-card, .category-tag, .magnetic-btn, input',
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () =>
      cursorRing.classList.remove('hover'),
    );
  });
}

// =============================================
// MAGNETIC BUTTONS
// =============================================
function initMagneticButtons() {
  if (window.innerWidth < 1024) return;
  document.querySelectorAll('[data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out',
      });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

// =============================================
// SCROLL PROGRESS BAR
// =============================================
function initScrollProgress() {
  gsap.to('#scrollProgress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

// =============================================
// LOADER ANIMATION
// =============================================
function initLoader() {
  const tl = gsap.timeline();

  // Counter animation
  const counter = { val: 0 };
  gsap.to(counter, {
    val: 100,
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      document.getElementById('loaderCounter').textContent = Math.floor(
        counter.val,
      );
    },
  });

  // Bar fill
  gsap.to('#loaderBarFill', {
    width: '100%',
    duration: 2.5,
    ease: 'power2.inOut',
  });

  // Hide loader
  tl.to('#loader', {
    yPercent: -100,
    duration: 1,
    ease: 'power4.inOut',
    delay: 2.8,
    onComplete: () => {
      document.getElementById('loader').style.display = 'none';
      initHeroAnimation();
    },
  });
}

// =============================================
// HERO ANIMATION
// =============================================
function initHeroAnimation() {
  const tl = gsap.timeline();

  // Navbar fade in
  tl.to(
    '#navbar',
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    0,
  );

  // SplitType on hero title
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    const split = new SplitType(heroTitle, { types: 'chars' });
    tl.from(
      split.chars,
      {
        y: 80,
        opacity: 0,
        rotateX: -40,
        duration: 1,
        stagger: 0.03,
        ease: 'power4.out',
      },
      0.1,
    );
  }

  // Label
  tl.to(
    '.hero-label',
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    0.3,
  );

  // Subtitle
  tl.to(
    '.hero-subtitle',
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    },
    0.6,
  );

  // CTA
  tl.to(
    '.hero-cta',
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
    },
    0.8,
  );

  // Scroll indicator
  tl.to(
    '.hero-scroll',
    {
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
    },
    1.2,
  );

  // Floating shapes parallax
  document.querySelectorAll('.floating-shape').forEach((shape, i) => {
    gsap.to(shape, {
      y: () => Math.random() * 100 - 50,
      x: () => Math.random() * 60 - 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

// =============================================
// SECTION HEADERS - SCROLL REVEAL
// =============================================
function initSectionHeaders() {
  document.querySelectorAll('.section-header').forEach(header => {
    const h2 = header.querySelector('h2');
    const span = header.querySelector('span');
    const p = header.querySelector('p');

    if (h2) {
      const splitH2 = new SplitType(h2, { types: 'chars' });
      gsap.from(splitH2.chars, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.015,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (span) {
      gsap.from(span, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }

    if (p) {
      gsap.from(p, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: header,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      });
    }
  });
}

// =============================================
// FEATURED CARDS ANIMATION
// =============================================
function initFeaturedCards() {
  gsap.from('.featured-card', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#featured',
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  });
}

// =============================================
// CATEGORY CARDS ANIMATION
// =============================================
function initCategoryCards() {
  gsap.from('.category-card', {
    y: 50,
    opacity: 0,
    scale: 0.95,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#categoryGrid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
}

// =============================================
// CATEGORY FILTER
// =============================================
function initCategoryFilter() {
  const tags = document.querySelectorAll('.category-tag');
  const cards = document.querySelectorAll('.category-card');

  tags.forEach(tag => {
    tag.addEventListener('click', () => {
      tags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      const filter = tag.dataset.filter;

      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            display: 'block',
          });
        } else {
          gsap.to(card, {
            opacity: 0,
            scale: 0.95,
            y: 20,
            duration: 0.3,
            ease: 'power3.in',
            onComplete: () => {
              card.style.display = 'none';
            },
          });
        }
      });
    });
  });
}

// =============================================
// ABOUT SECTION ANIMATIONS
// =============================================
function initAboutSection() {
  // Image reveal
  ScrollTrigger.create({
    trigger: '#aboutImgReveal',
    start: 'top 80%',
    onEnter: () => {
      document.getElementById('aboutImgReveal').classList.add('revealed');
    },
  });

  // Badge float
  gsap.to('.about-badge', {
    y: -10,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  });

  // Content stagger
  gsap.from('.about-label', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.about-content', start: 'top 80%' },
  });

  const aboutTitle = document.querySelector('.about-title');
  if (aboutTitle) {
    const splitTitle = new SplitType(aboutTitle, { types: 'words' });
    gsap.from(splitTitle.words, {
      y: 30,
      opacity: 0,
      duration: 0.5,
      stagger: 0.03,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-content', start: 'top 80%' },
    });
  }

  gsap.from('.about-text p', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.about-text', start: 'top 85%' },
  });

  gsap.from('.stat-item', {
    y: 30,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.stat-item', start: 'top 90%' },
  });

  gsap.from('.skill-tag', {
    y: 15,
    opacity: 0,
    duration: 0.3,
    stagger: 0.05,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.about-skills', start: 'top 90%' },
  });

  gsap.from('.about-socials a', {
    y: 15,
    opacity: 0,
    duration: 0.3,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.about-socials', start: 'top 90%' },
  });

  // Counter animation
  document.querySelectorAll('.stat-number').forEach(stat => {
    const target = parseInt(stat.dataset.count);
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            stat.textContent = Math.floor(counter.val);
          },
        });
      },
      once: true,
    });
  });
}

// =============================================
// ARTICLES GRID ANIMATION
// =============================================
function initArticlesGrid() {
  gsap.from('.article-card', {
    y: 50,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#articlesGrid',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });

  // Tilt effect on cards
  if (window.innerWidth >= 1024) {
    document.querySelectorAll('.article-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(card, {
          rotateX: y * -8,
          rotateY: x * 8,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 1000,
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }
}

// =============================================
// HORIZONTAL SCROLL
// =============================================
function initHorizontalScroll() {
  const track = document.getElementById('horizontalTrack');
  if (!track || window.innerWidth < 768) return;

  const totalScroll = track.scrollWidth - window.innerWidth;

  gsap.to(track, {
    x: -totalScroll,
    ease: 'none',
    scrollTrigger: {
      trigger: '.horizontal-scroll-wrapper',
      start: 'top 20%',
      end: () => `+=${totalScroll}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
    },
  });
}

// =============================================
// NEWSLETTER ANIMATION
// =============================================
function initNewsletter() {
  gsap.from('.newsletter-card', {
    y: 60,
    opacity: 0,
    scale: 0.96,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.newsletter-card',
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  });

  // Form submission
  document.getElementById('newsletterForm').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('emailInput').value;
    if (email) {
      showToast('Welcome aboard! Check your inbox for a confirmation.');
      document.getElementById('emailInput').value = '';
    }
  });
}

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
function initNavbarScroll() {
  ScrollTrigger.create({
    start: 'top -80',
    onUpdate: self => {
      if (self.direction === 1 && self.scroll() > 80) {
        document.getElementById('navbar').classList.add('scrolled');
      }
      if (self.scroll() <= 80) {
        document.getElementById('navbar').classList.remove('scrolled');
      }
    },
  });

  // Initial state
  gsap.set('#navbar', { opacity: 0, y: -20 });
}

// =============================================
// SEARCH MODAL
// =============================================
function initSearchModal() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');

  document.getElementById('searchBtn').addEventListener('click', () => {
    modal.classList.add('active');
    setTimeout(() => input.focus(), 300);
  });

  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('active');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.classList.remove('active');
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      modal.classList.add('active');
      setTimeout(() => input.focus(), 300);
    }
  });

  // Search links close modal
  document.querySelectorAll('.search-link').forEach(link => {
    link.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  });
}

// =============================================
// DARK/LIGHT MODE TOGGLE
// =============================================
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const darkIcon = btn.querySelector('.dark-icon');
  const lightIcon = btn.querySelector('.light-icon');

  btn.addEventListener('click', () => {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');

    // Page transition
    const transition = document.getElementById('pageTransition');
    gsap
      .timeline()
      .to(transition, {
        scaleY: 1,
        transformOrigin: 'bottom',
        duration: 0.4,
        ease: 'power4.inOut',
      })
      .add(() => {
        if (isDark) {
          html.classList.remove('dark');
          html.classList.add('light');
          darkIcon.classList.add('hidden');
          lightIcon.classList.remove('hidden');
          document.body.style.background = '#fafafa';
          document.body.style.color = '#171717';
        } else {
          html.classList.remove('light');
          html.classList.add('dark');
          lightIcon.classList.add('hidden');
          darkIcon.classList.remove('hidden');
          document.body.style.background = '#0a0a0a';
          document.body.style.color = '#e5e5e5';
        }
      })
      .to(transition, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.4,
        ease: 'power4.inOut',
      });
  });
}

// =============================================
// MOBILE MENU
// =============================================
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const icon = document.getElementById('menuIcon');
  let isOpen = false;

  btn.addEventListener('click', () => {
    isOpen = !isOpen;
    if (isOpen) {
      menu.classList.add('active');
      icon.setAttribute('icon', 'lucide:x');
      lenis.stop();
    } else {
      menu.classList.remove('active');
      icon.setAttribute('icon', 'lucide:menu');
      lenis.start();
    }
  });

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
      icon.setAttribute('icon', 'lucide:menu');
      isOpen = false;
      lenis.start();
    });
  });
}

// =============================================
// TOAST NOTIFICATION
// =============================================
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// =============================================
// COPY LINK
// =============================================
function copyLink(id) {
  const url = window.location.href + '#' + id;
  navigator.clipboard
    .writeText(url)
    .then(() => {
      showToast('Link copied to clipboard!');
    })
    .catch(() => {
      showToast('Link: ' + url);
    });
}

// =============================================
// IMAGE PARALLAX
// =============================================
function initImageParallax() {
  document.querySelectorAll('.blog-card-img').forEach(img => {
    gsap.to(img, {
      yPercent: -8,
      ease: 'none',
      scrollTrigger: {
        trigger: img.closest('.glass-card'),
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  });
}

// =============================================
// SCALE ON SCROLL (Featured card)
// =============================================
function initScaleOnScroll() {
  document.querySelectorAll('.featured-card').forEach((card, i) => {
    gsap.from(card, {
      scale: 0.92,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

// =============================================
// BLUR REVEAL FOR GALLERY IMAGES
// =============================================
function initBlurReveal() {
  document.querySelectorAll('.img-reveal').forEach(reveal => {
    gsap.from(reveal, {
      filter: 'blur(20px)',
      opacity: 0.5,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: reveal,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

// =============================================
// PINNED TEXT (Sticky text between sections)
// =============================================
function initPinnedText() {
  // We'll add a pinned quote section effect on the marquee
  const marqueeSection = document.querySelector('.marquee-track');
  if (marqueeSection) {
    gsap.to(marqueeSection, {
      opacity: 0.5,
      scrollTrigger: {
        trigger: marqueeSection.parentElement,
        start: 'top center',
        end: 'bottom center',
        scrub: true,
      },
    });
  }
}

// =============================================
// CARD HOVER GLOW BORDER
// =============================================
function initCardGlow() {
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
      card.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(255,77,0,0.04), transparent 60%), rgba(255,255,255,0.03)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = 'rgba(255,255,255,0.03)';
    });
  });
}

// =============================================
// LIGHT MODE CARD GLOW FIX
// =============================================
function watchThemeForGlow() {
  const observer = new MutationObserver(() => {
    const isLight = document.documentElement.classList.contains('light');
    document.querySelectorAll('.glass-card').forEach(card => {
      if (isLight) {
        card.style.background = 'rgba(255,255,255,0.7)';
      } else {
        card.style.background = 'rgba(255,255,255,0.03)';
      }
    });
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

// =============================================
// LAUNCH EVERYTHING
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCursor();
  initMagneticButtons();
  initScrollProgress();
  initLoader();
  initSectionHeaders();
  initFeaturedCards();
  initCategoryCards();
  initCategoryFilter();
  initAboutSection();
  initArticlesGrid();
  initHorizontalScroll();
  initNewsletter();
  initNavbarScroll();
  initSearchModal();
  initThemeToggle();
  initMobileMenu();
  initImageParallax();
  initScaleOnScroll();
  initBlurReveal();
  initPinnedText();
  initCardGlow();
  watchThemeForGlow();

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -80 });
      }
    });
  });

  // Refresh ScrollTrigger after all content loads
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
