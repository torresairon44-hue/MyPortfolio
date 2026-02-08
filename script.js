// ===== GSAP SETUP =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== LENIS SMOOTH SCROLL =====
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth: true,
  smoothTouch: false,
});

// Sync GSAP with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ===== CUSTOM CURSOR (DISABLED FOR PERFORMANCE) =====
/*
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  // Smooth cursor movement
  cursorX += (mouseX - cursorX) * 0.2;
  cursorY += (mouseY - cursorY) * 0.2;
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;

  cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
  cursorFollower.style.transform = `translate(${followerX}px, ${followerY}px)`;

  requestAnimationFrame(animateCursor);
}

animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-card');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform += ' scale(1.5)';
    cursorFollower.style.transform += ' scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
    cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
  });
});
*/

// ===== SCROLL PROGRESS =====
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrollPercentage = (scrollTop / scrollHeight) * 100;
  scrollProgress.style.width = scrollPercentage + '%';
});

// ===== PARTICLE CANVAS BACKGROUND (DISABLED FOR PERFORMANCE) =====
/*
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const particleCount = 30; // Reduced from 80 for better performance
const connectionDistance = 120; // Reduced connection distance

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    ctx.fillStyle = 'rgba(96, 165, 250, 0.6)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Initialize particles
for (let i = 0; i < particleCount; i++) {
  particles.push(new Particle());
}

function connectParticles() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        const opacity = 1 - distance / connectionDistance;
        ctx.strokeStyle = `rgba(96, 165, 250, ${opacity * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(particle => {
    particle.update();
    particle.draw();
  });

  connectParticles();
  requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize handler
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
*/

// ===== NAVIGATION =====
const header = document.querySelector('.site-header');
const navLinks = document.querySelectorAll('.nav-link');

// Show nav on scroll
ScrollTrigger.create({
  start: 'top -100',
  end: 99999,
  toggleClass: { className: 'visible', targets: '.site-header' }
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section-snap');
sections.forEach((section, index) => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveLink(index),
    onEnterBack: () => setActiveLink(index),
  });
});

function setActiveLink(index) {
  navLinks.forEach(link => link.classList.remove('active'));
  navLinks[index]?.classList.add('active');
}

// Smooth scroll to sections
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    // Close mobile menu if open
    const navLinksContainer = document.querySelector('.nav-links');
    const menuToggle = document.getElementById('menuToggle');
    const navOverlay = document.getElementById('navOverlay');

    if (navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
      menuToggle.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    lenis.scrollTo(targetSection, {
      offset: 0,
      duration: 1.5,
    });
  });
});

// ===== MOBILE HAMBURGER MENU =====
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.querySelector('.nav-links');
const navOverlay = document.getElementById('navOverlay');

if (menuToggle && navLinksContainer) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
    navOverlay?.classList.toggle('active');

    // Prevent body scroll when menu is open
    if (navLinksContainer.classList.contains('active')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Close menu when clicking overlay
  navOverlay?.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    navLinksContainer.classList.remove('active');
    navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinksContainer.classList.contains('active')) {
      menuToggle.classList.remove('active');
      navLinksContainer.classList.remove('active');
      navOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

// ===== SCROLL INDICATOR =====
const scrollIndicator = document.querySelector('.scroll-indicator');
scrollIndicator?.addEventListener('click', () => {
  lenis.scrollTo('#about', {
    offset: 0,
    duration: 1.5,
  });
});

// ===== TYPEWRITER EFFECT =====
const textToType = "Ronald Airon S. Torres | BSIT Student";
const typingElement = document.querySelector('.typing-text');
let charIndex = 0;

function typeWriter() {
  if (charIndex < textToType.length) {
    typingElement.textContent += textToType.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, 100); // Typing speed
  }
}

// Start typing after initial animations
setTimeout(() => {
  if (typingElement) {
    typeWriter();
  }
}, 1500);

// ===== COLOR CHANGER =====
const scrollColorElems = document.querySelectorAll("[data-bgcolor]");
scrollColorElems.forEach((colorSection, i) => {
  const prevBg = i === 0 ? "#000000" : scrollColorElems[i - 1].dataset.bgcolor;
  const prevText = i === 0 ? "#f8fafc" : scrollColorElems[i - 1].dataset.textcolor;

  ScrollTrigger.create({
    trigger: colorSection,
    start: "top 50%",
    onEnter: () =>
      gsap.to("body", {
        backgroundColor: colorSection.dataset.bgcolor,
        color: colorSection.dataset.textcolor,
        duration: 0.8,
        overwrite: "auto"
      }),
    onEnterBack: () =>
      gsap.to("body", {
        backgroundColor: colorSection.dataset.bgcolor,
        color: colorSection.dataset.textcolor,
        duration: 0.8,
        overwrite: "auto"
      }),
    onLeaveBack: () =>
      gsap.to("body", {
        backgroundColor: prevBg,
        color: prevText,
        duration: 0.8,
        overwrite: "auto"
      })
  });
});

// Simple fade-in for sections only
gsap.utils.toArray('.section-snap').forEach(section => {
  gsap.from(section.children, {
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
  });
});

// ===== 3D TILT EFFECT ON CARDS (DISABLED) =====
/*
const tiltCards = document.querySelectorAll('.project-card, .skill-card');

tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});
*/

// ===== LIGHTBOX =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.view-project-btn, .view-cert-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card = btn.closest('.project-split-card') || btn.closest('.cert-item');
    if (card) {
      const img = card.querySelector('img');
      if (img) {
        lightboxImage.src = img.src;
        lightbox.classList.add('active');
      }
    }
  });
});

lightboxClose?.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.classList.remove('active');
  }
});

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== TEXT SCRAMBLE EFFECT (Optional Enhancement) =====
class TextScramble {
  constructor(el) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    this.update = this.update.bind(this);
  }

  setText(newText) {
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => this.resolve = resolve);
    this.queue = [];

    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({ from, to, start, end });
    }

    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = '';
    let complete = 0;

    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];

      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span class="dud">${char}</span>`;
      } else {
        output += from;
      }
    }

    this.el.innerHTML = output;

    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

// Apply scramble effect to main title on load
const titleElement = document.querySelector('.main-title .word');
if (titleElement) {
  const fx = new TextScramble(titleElement);
  setTimeout(() => {
    fx.setText('Portfolio');
  }, 1000);
}

// ===== MAGNETIC BUTTONS (DISABLED) =====
/*
const magneticButtons = document.querySelectorAll('.btn-primary, .btn-secondary');

magneticButtons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});
*/

// ===== ABOUT PROFILE 3D TILT =====
function initAboutTilt() {
  const wrapper = document.querySelector('.profile-3d-wrapper');
  const container = document.querySelector('.circular-3d');
  const img = document.querySelector('.profile-img');

  if (!wrapper || !container) return;

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    // Apply tilt to the container
    gsap.to(container, {
      rotateX: rotateX,
      rotateY: rotateY,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Subtly move the image in opposite direction for parallax
    gsap.to(img, {
      x: rotateY * 2,
      y: -rotateX * 2,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  });

  wrapper.addEventListener('mouseleave', () => {
    gsap.to(container, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });

    gsap.to(img, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)'
    });
  });
}

// ===== ABOUT REVEAL ANIMATION =====
function initAboutReveal() {
  const section = document.querySelector('.about-section');
  if (!section) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 70%',
    }
  });

  tl.from('.about-visual-col', {
    x: -100,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out'
  })
    .from('.about-watermark', {
      x: -50,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out'
    }, '-=1')
    .from(['.about-header-modern', '.bio-wrapper', '.stats-row', '.about-cta-modern'], {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.15,
      ease: 'power3.out'
    }, '-=1.2')
    .from('.visual-tagline', {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.5');

  // Parallax for all watermarks
  gsap.utils.toArray('.section-watermark').forEach(watermark => {
    gsap.to(watermark, {
      y: 100,
      scrollTrigger: {
        trigger: watermark.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });
}

// ===== CERTIFICATES REVEAL =====
function initCertificatesReveal() {
  const section = document.querySelector('.certificates-section');
  if (!section) return;

  gsap.from('.cert-item', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
    }
  });
}

// Call on load
window.addEventListener('load', () => {
  initAboutTilt();
  initAboutReveal();
  initCertificatesReveal();
});

// ===== PARALLAX EFFECT ON PROFILE IMAGE =====
const profileContainer = document.querySelector('.profile-3d-wrapper');

if (profileContainer) {
  gsap.to('.profile-img', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}
// ===== SKILLS SCATTERED BUBBLES =====
function initScatteredSkills() {
  const container = document.getElementById('bubbleContainer');
  if (!container) return;

  const bubbles = container.querySelectorAll('.bubble');
  // Use clientWidth/Height for more accurate measurements of the available space
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;

  const PADDING = 40;
  const MIN_DISTANCE = 170; // Increased even more for strict non-overlap
  const MAX_ATTEMPTS = 250; // Significantly more attempts for better results

  const placedPositions = [];

  bubbles.forEach((bubble) => {
    let randomX = 0, randomY = 0;
    let attempts = 0;
    let overlap = true;

    const bubbleWidth = bubble.offsetWidth || 100;
    const bubbleHeight = bubble.offsetHeight || 100;

    const maxX = containerWidth - bubbleWidth - PADDING;
    const maxY = containerHeight - bubbleHeight - PADDING;

    while (overlap && attempts < MAX_ATTEMPTS) {
      randomX = PADDING + Math.random() * maxX;
      randomY = PADDING + Math.random() * maxY;

      const centerX = randomX + bubbleWidth / 2;
      const centerY = randomY + bubbleHeight / 2;

      overlap = placedPositions.some(pos => {
        const dx = pos.x - centerX;
        const dy = pos.y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < MIN_DISTANCE;
      });

      attempts++;
    }

    // Capture the valid center for future checks
    placedPositions.push({
      x: randomX + bubbleWidth / 2,
      y: randomY + bubbleHeight / 2
    });

    // Set position instantly
    bubble.style.left = randomX + 'px';
    bubble.style.top = randomY + 'px';
    bubble.style.opacity = '1';
    bubble.style.transform = `scale(1) rotate(${Math.random() * 8 - 4}deg)`;
  });
}

// Call on load
window.addEventListener('load', initScatteredSkills);
// Also call on resize for responsiveness
window.addEventListener('resize', () => {
  // Simple re-init on resize to keep positions logical
  const bubbles = document.querySelectorAll('.bubble');
  bubbles.forEach(b => gsap.killTweensOf(b));
  initScatteredSkills();
});


// ===== PROJECTS PAGINATION =====
function initProjectPagination() {
  const cards = gsap.utils.toArray('.project-split-card');
  const pgNums = document.querySelectorAll('.pg-num');
  const pgNext = document.getElementById('pgNext');
  let currentPage = 1;

  if (cards.length === 0) return;

  function showPage(page) {
    currentPage = page;

    // Update buttons
    pgNums.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.page) === page);
    });

    // Hide/Show cards
    cards.forEach((card, index) => {
      const startIndex = (page - 1) * 3;
      const endIndex = startIndex + 3;

      if (index >= startIndex && index < endIndex) {
        card.classList.remove('hidden');
        gsap.fromTo(card,
          { opacity: 0, y: 30, filter: 'blur(10px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', delay: (index % 3) * 0.1 }
        );
      } else {
        card.classList.add('hidden');
      }
    });

    // Handle Next button visibility
    if (pgNext) {
      pgNext.style.display = (page >= 2) ? 'none' : 'flex';
    }

    // Smooth scroll back to section top
    const projectsSection = document.getElementById('projects');
    if (projectsSection && window.lenis) {
      window.lenis.scrollTo(projectsSection, { offset: -80, duration: 1.2 });
    }

    // Refresh ScrollTrigger to update heights for following sections
    ScrollTrigger.refresh();
  }

  pgNums.forEach(btn => {
    btn.addEventListener('click', () => {
      const page = parseInt(btn.dataset.page);
      if (page !== currentPage) showPage(page);
    });
  });

  pgNext?.addEventListener('click', () => {
    if (currentPage < 2) showPage(currentPage + 1);
  });

  // Start at page 1
  showPage(1);
}

// Call on load
window.addEventListener('load', initProjectPagination);


// ===== SCROLL TO TOP =====
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });

  scrollTopBtn.addEventListener('click', () => {
    // If Lenis is available, use it for smooth scrolling
    if (typeof lenis !== 'undefined') {
      lenis.scrollTo(0, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  });
}

// ===== CONSOLE MESSAGE =====
console.log('%c🚀 Portfolio by Ronald Airon S. Torres', 'color: #60a5fa; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with GSAP, Lenis, and passion!', 'color: #94a3b8; font-size: 14px;');
