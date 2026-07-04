import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations(lenis) {
  // --- 1. AMBIENT LIGHTING GLOW POSITION TRANSLATIONS ---
  const glowBlue = document.querySelector('.glow-blue');
  const glowPurple = document.querySelector('.glow-purple');
  
  if (glowBlue && glowPurple) {
    // Smooth scroll triggers to move the background ambient halos
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.to(glowBlue, {
          x: p * 240,
          y: p * 300,
          scale: 1 + p * 0.2,
          opacity: 0.08 + p * 0.04,
          overwrite: 'auto'
        });
        gsap.to(glowPurple, {
          x: -p * 180,
          y: -p * 240,
          scale: 1 + p * 0.15,
          opacity: 0.08 + p * 0.02,
          overwrite: 'auto'
        });
      }
    });

    ScrollTrigger.create({
      trigger: '#services',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        gsap.to(glowBlue, {
          x: 240 - p * 400,
          y: 300 - p * 150,
          opacity: 0.06,
          overwrite: 'auto'
        });
        gsap.to(glowPurple, {
          x: -180 + p * 300,
          y: -240 + p * 400,
          opacity: 0.09,
          overwrite: 'auto'
        });
      }
    });

    ScrollTrigger.create({
      trigger: '#projects',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: (self) => {
        const p = self.progress;
        // Dim ambient lights to pure black focus in case studies section
        gsap.to(glowBlue, { opacity: 0.03 + (1 - p) * 0.03, overwrite: 'auto' });
        gsap.to(glowPurple, { opacity: 0.03 + (1 - p) * 0.05, overwrite: 'auto' });
      }
    });

    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top bottom',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const p = self.progress;
        // Bring glows to center backplate behind contact card
        gsap.to(glowBlue, {
          left: '35%',
          top: '35%',
          opacity: 0.18 * p,
          scale: 1.3,
          overwrite: 'auto'
        });
        gsap.to(glowPurple, {
          right: '35%',
          bottom: '35%',
          opacity: 0.18 * p,
          scale: 1.4,
          overwrite: 'auto'
        });
      }
    });
  }

  // --- 2. LUXURY TEXT & NARRATIVE REVEALS ---
  const textReveals = document.querySelectorAll('.section-title-large, .section-title, .about-lead, .about-quote-block blockquote, .philosophy-intro h2');
  textReveals.forEach(text => {
    gsap.fromTo(text, 
      { opacity: 0, y: 35 },
      {
        opacity: 1, 
        y: 0, 
        duration: 1.4, 
        ease: 'power4.out',
        scrollTrigger: {
          trigger: text,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Story narrative rows fade-in and scale
  const narrativeRows = document.querySelectorAll('.narrative-row');
  narrativeRows.forEach(row => {
    const text = row.querySelector('.narrative-text');
    const visual = row.querySelector('.narrative-visual');
    
    if (text) {
      gsap.fromTo(text,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
    
    if (visual) {
      // Scale visual up slightly on enter to simulate depth
      gsap.fromTo(visual,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  // --- 3. IMMERSIVE SERVICES DECK STAGGER ---
  const serviceDeckItems = document.querySelectorAll('.service-deck-item');
  serviceDeckItems.forEach(item => {
    const details = item.querySelector('.service-deck-details');
    const visual = item.querySelector('.service-deck-visual');
    
    if (details) {
      gsap.fromTo(details,
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (visual) {
      gsap.fromTo(visual,
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  // --- 4. PROJECTS MINI LANDING PARALLAX & REVEALS ---
  const projectMiniLandings = document.querySelectorAll('.project-mini-landing');
  projectMiniLandings.forEach(project => {
    const heroMockup = project.querySelector('.mini-landing-mockup');
    const titleBlock = project.querySelector('.mini-landing-title-wrap');
    const gridCols = project.querySelectorAll('.case-study-grid > .case-col');

    if (heroMockup) {
      // Parallax scroll on mockups
      gsap.fromTo(heroMockup,
        { y: 60 },
        {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: project,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }

    if (titleBlock) {
      gsap.fromTo(titleBlock,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: project,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    if (gridCols.length > 0) {
      gsap.fromTo(gridCols,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: project.querySelector('.case-study-grid'),
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }
  });

  // Split phone offsets
  const phoneOffsetY = document.querySelector('.phone-offset-y');
  if (phoneOffsetY) {
    gsap.fromTo(phoneOffsetY,
      { y: 40 },
      {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: phoneOffsetY.closest('.project-mini-landing'),
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  }

  // --- 5. PHILOSOPHY POINTS REVEALS ---
  gsap.fromTo('.philosophy-point-item',
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.philosophy-points-list',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    }
  );

  // --- 6. PROCESS JOURNEY PROGRESS TIMELINE ---
  const timelineFill = document.querySelector('.timeline-progress-fill');
  const steps = document.querySelectorAll('.timeline-step');
  
  if (timelineFill && steps.length > 0) {
    gsap.fromTo(timelineFill,
      { height: '0%' },
      {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.process-timeline-wrapper',
          start: 'top 30%',
          end: 'bottom 40%',
          scrub: true
        }
      }
    );

    steps.forEach((step, idx) => {
      ScrollTrigger.create({
        trigger: step,
        start: 'top 45%',
        end: 'bottom 45%',
        onEnter: () => activateStep(idx),
        onEnterBack: () => activateStep(idx),
      });
    });
    
    function activateStep(activeIndex) {
      steps.forEach((step, idx) => {
        if (idx <= activeIndex) {
          step.classList.add('active');
          gsap.to(step.querySelector('.step-dot'), {
            scale: 1.25,
            backgroundColor: '#0052ff',
            borderColor: '#0052ff',
            boxShadow: '0 0 10px rgba(0, 82, 255, 0.4)',
            duration: 0.3
          });
        } else {
          step.classList.remove('active');
          gsap.to(step.querySelector('.step-dot'), {
            scale: 1,
            backgroundColor: '#050505',
            borderColor: 'rgba(255, 255, 255, 0.04)',
            boxShadow: 'none',
            duration: 0.3
          });
        }
      });
    }
  }
}
