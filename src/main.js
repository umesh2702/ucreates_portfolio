import './style.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Import custom modules
import { initThreeScene } from './three-scene.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initServicesVisuals } from './services-visuals.js';
import { initTechClusters } from './tech-clusters.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialise Loader & Page Setup
  setupLoader();
  
  // 2. Initialise Custom Cursor
  setupCustomCursor();
  
  // 3. Initialise Lenis Smooth Scroll
  const lenis = setupSmoothScroll();
  
  // 4. Initialise Magnetic Buttons
  setupMagneticButtons();
  
  // 5. Header Scroll Effect
  setupHeaderScroll();
  
  // 6. Contact Form Submission
  setupContactForm();

  // 7. Initialize Sub-modules
  try {
    initThreeScene();
  } catch (err) {
    console.error('WebGL/Three.js failed to load:', err);
  }
  
  initScrollAnimations(lenis);
  initServicesVisuals();
  initTechClusters();
});

// Simulate Loading Progress
function setupLoader() {
  const loader = document.getElementById('loader');
  const progressBar = document.querySelector('.loader-bar');
  const percentageText = document.querySelector('.loader-percentage');
  
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      
      // Hide loader
      setTimeout(() => {
        loader.classList.add('loaded');
        document.body.classList.remove('loading');
        // Trigger reveal animations once loaded
        gsap.to('.reveal-item', {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          delay: 0.2
        });
      }, 500);
    }
    
    progressBar.style.width = `${progress}%`;
    percentageText.textContent = `${progress}%`;
  }, 40);
  
  document.body.classList.add('loading');
}

// Custom Cursor Trail and Glow
function setupCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const glow = document.getElementById('cursor-glow');
  
  if (!cursor || !glow) return;
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  
  // Interpolation for smooth cursor follow
  function animateCursor() {
    // Quick follow for dot
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    // Slow follow with delay for glow
    glowX += (mouseX - glowX) * 0.1;
    glowY += (mouseY - glowY) * 0.1;
    glow.style.left = `${glowX}px`;
    glow.style.top = `${glowY}px`;
    
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);
  
  // Interactive element hover states
  const interactives = document.querySelectorAll('a, button, input, select, textarea, .glow-border-hover, .timeline-step');
  
  interactives.forEach(item => {
    item.addEventListener('mouseenter', () => {
      document.body.classList.add('hovering-interactive');
    });
    item.addEventListener('mouseleave', () => {
      document.body.classList.remove('hovering-interactive');
    });
  });
}

// Lenis Smooth Scroll Configuration
function setupSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 1.5,
    infinite: false,
  });

  // Connect Lenis to requestAnimationFrame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  
  gsap.ticker.lagSmoothing(0);
  
  return lenis;
}

// Magnetic Button Motion Math
function setupMagneticButtons() {
  const elements = document.querySelectorAll('.btn-magnetic');
  
  elements.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      // Mouse coordinates relative to button center
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull button slightly toward cursor
      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      // Pull text/inner content even more to create parallax depth
      const innerText = btn.querySelector('span');
      if (innerText) {
        gsap.to(innerText, {
          x: x * 0.18,
          y: y * 0.18,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    });
    
    btn.addEventListener('mouseleave', () => {
      // Snap back to origin
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
      });
      
      const innerText = btn.querySelector('span');
      if (innerText) {
        gsap.to(innerText, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      }
    });
  });
}

// Header Navigation styling changes on scroll
function setupHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// Contact Lead Generation Form Handling
function setupContactForm() {
  const form = document.getElementById('lead-form');
  const status = document.getElementById('form-status');
  
  if (!form || !status) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Animate button during "submission"
    const submitBtn = form.querySelector('.btn-submit');
    const originalText = submitBtn.querySelector('span').textContent;
    submitBtn.querySelector('span').textContent = 'Transmission in progress...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
      // Simulate success response
      status.style.color = '#00ff66';
      status.textContent = 'Transmission complete. Mesh connection established. We will respond shortly.';
      submitBtn.querySelector('span').textContent = 'Inquiry Sent';
      
      form.reset();
      
      // Remove status message after a few seconds
      setTimeout(() => {
        status.textContent = '';
        submitBtn.querySelector('span').textContent = originalText;
        submitBtn.disabled = false;
      }, 5000);
    }, 1500);
  });
}
