export const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzVPBOfzSIO2PiD8k2Q8M7zfcSzrp4fTdWYe6M4abJYQKHP94agVnTqnlN8ZIkK2wJ1/exec";
export const GOOGLE_SCRIPT_URL = GOOGLE_APPS_SCRIPT_URL;

/**
 * PROJECT DEMO URL REGISTRY
 * Discovered demo URLs and placeholders for upcoming deployments:
 */
export const PROJECT_DEMO_URLS = {
  ULINK_LIVE: "https://live-pi-seven.vercel.app/",
  ISDSI_SUMMIT: null, // Placeholder: Supply live demo URL when deployed
  ITIHAAS_VALET: "https://valet-77y7.vercel.app/"
};

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
      if (btn.disabled || btn.hasAttribute('disabled')) return;
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

// Google Apps Script Contact Lead Generation Form Handling
function setupContactForm() {
  const form = document.getElementById('lead-form');
  const status = document.getElementById('form-status');
  const successState = document.getElementById('lead-success');

  if (!form || !status || !successState) return;

  function validateForm(name, email, message) {
    if (!name.trim()) return "Full Name is required.";
    if (!email.trim()) return "Email Address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
    if (!message.trim()) return "Message is required.";
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const phone = document.getElementById('form-phone').value;
    const serviceSelect = document.getElementById('form-service');
    const service = serviceSelect ? serviceSelect.value : '';
    const message = document.getElementById('form-message').value;

    status.textContent = '';
    status.className = 'form-status-msg';

    const validationError = validateForm(name, email, message);
    if (validationError) {
      status.textContent = validationError;
      status.classList.add('error-msg');
      return;
    }

    const submitBtn = form.querySelector('.btn-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    btnText.textContent = 'Submitting...';
    if (btnLoader) btnLoader.style.display = 'inline-flex';
    submitBtn.disabled = true;

    const payload = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      service: service.trim(),
      message: message.trim()
    };

    try {
      if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('YOUR_APPS_SCRIPT_WEB_APP_ID_HERE')) {
        status.textContent = "Google Apps Script Web App endpoint is not yet configured. Please supply the URL in src/main.js.";
        status.classList.add('error-msg');
        return;
      }

      await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      form.reset();
      gsap.to(form, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          form.style.display = 'none';
          successState.style.display = 'flex';
          gsap.fromTo(successState,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
    } catch (error) {
      console.error('Google Apps Script Submission Error:', error);
      status.textContent = "Unable to process enquiry right now. Please try again or email umesh@ucreates.online.";
      status.classList.add('error-msg');
    } finally {
      btnText.textContent = 'Submit Enquiry';
      if (btnLoader) btnLoader.style.display = 'none';
      submitBtn.disabled = false;
    }
  });

  const backHomeBtn = successState.querySelector('.success-btn-home');
  if (backHomeBtn) {
    backHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      gsap.to(successState, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          successState.style.display = 'none';
          status.textContent = '';
          status.className = 'form-status-msg';
          form.style.display = 'flex';
          gsap.fromTo(form,
            { opacity: 0, y: -20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          );
        }
      });
    });
  }
}
