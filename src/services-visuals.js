import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initServicesVisuals() {
  initNeuralCanvas();
  initAutomationCanvas();
  initMobileChartAnimation();
}

// 1. AI Service - Waving Gravitational Fabric Grid (OpenAI / Vercel style)
function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  const gridSpacing = 24;
  const cols = Math.floor(width / gridSpacing);
  const rows = Math.floor(height / gridSpacing);
  const points = [];
  
  let mouse = { x: null, y: null, active: false };

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Create grid of points
  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      points.push({
        baseX: c * gridSpacing + (width - cols * gridSpacing) / 2,
        baseY: r * gridSpacing + (height - rows * gridSpacing) / 2,
        x: c * gridSpacing + (width - cols * gridSpacing) / 2,
        y: r * gridSpacing + (height - rows * gridSpacing) / 2,
        vx: 0,
        vy: 0
      });
    }
  }

  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => isVisible = e.isIntersecting);
  });
  observer.observe(canvas);

  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    time += 0.02;
    ctx.clearRect(0, 0, width, height);

    points.forEach(p => {
      // 1. Natural slow sinusoidal wave motion (fabric ripple)
      const waveOffset = Math.sin(p.baseX * 0.01 + time) * Math.cos(p.baseY * 0.01 + time) * 8;
      const targetY = p.baseY + waveOffset;
      const targetX = p.baseX;

      // 2. Mouse deflection (grid pulls/pushes from mouse coordinate)
      let dx = 0;
      let dy = 0;
      if (mouse.active && mouse.x !== null) {
        dx = p.x - mouse.x;
        dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 120) {
          // Gravitational pull/push effect
          const force = (120 - dist) / 120;
          const angle = Math.atan2(dy, dx);
          // Push away slightly
          p.vx += Math.cos(angle) * force * 1.5;
          p.vy += Math.sin(angle) * force * 1.5;
        }
      }

      // Spring physics back to base wave position
      p.vx += (targetX - p.x) * 0.06;
      p.vy += (targetY - p.y) * 0.06;

      // Apply physics damping
      p.vx *= 0.85;
      p.vy *= 0.85;
      p.x += p.vx;
      p.y += p.vy;

      // Draw faint dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fill();

      // Connect lines to right and down neighbors (faint grid overlay)
      const r = Math.floor((p.baseY - (height - rows * gridSpacing) / 2) / gridSpacing);
      const c = Math.floor((p.baseX - (width - cols * gridSpacing) / 2) / gridSpacing);

      if (c < cols) {
        const rightNeighbor = points[r * (cols + 1) + (c + 1)];
        if (rightNeighbor) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(rightNeighbor.x, rightNeighbor.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
      if (r < rows) {
        const downNeighbor = points[(r + 1) * (cols + 1) + c];
        if (downNeighbor) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(downNeighbor.x, downNeighbor.y);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
  }
  animate();

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    // Re-adjust grid
    const cols = Math.floor(width / gridSpacing);
    const rows = Math.floor(height / gridSpacing);
    points.length = 0;
    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        points.push({
          baseX: c * gridSpacing + (width - cols * gridSpacing) / 2,
          baseY: r * gridSpacing + (height - rows * gridSpacing) / 2,
          x: c * gridSpacing + (width - cols * gridSpacing) / 2,
          y: r * gridSpacing + (height - rows * gridSpacing) / 2,
          vx: 0,
          vy: 0
        });
      }
    }
  });
}

// 2. Automation Service - Flow Stream Particles (Abstract kinetic animation)
function initAutomationCanvas() {
  const canvas = document.getElementById('automation-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  const particles = [];
  const particleCount = 18;
  
  // Create abstract curved flow paths
  const paths = [
    (t) => ({
      x: t * width,
      y: height * 0.5 + Math.sin(t * Math.PI * 2) * 50
    }),
    (t) => ({
      x: t * width,
      y: height * 0.35 + Math.cos(t * Math.PI * 2) * 40
    }),
    (t) => ({
      x: t * width,
      y: height * 0.65 + Math.sin(t * Math.PI * 2 - Math.PI/2) * 45
    })
  ];

  class FlowParticle {
    constructor() {
      this.reset();
      this.progress = Math.random(); // Start at random progress
    }

    reset() {
      this.progress = 0;
      this.speed = Math.random() * 0.003 + 0.0012;
      this.pathIndex = Math.floor(Math.random() * paths.length);
      this.radius = Math.random() * 2 + 1.5;
      // Fade in/out factor
      this.color = Math.random() > 0.5 ? '#0052ff' : '#8a2be2';
    }

    update() {
      this.progress += this.speed;
      if (this.progress > 1) {
        this.reset();
      }
    }

    draw() {
      const getPos = paths[this.pathIndex];
      const pos = getPos(this.progress);
      
      // Calculate opacity (fade at start and end of path)
      let alpha = 1;
      if (this.progress < 0.1) {
        alpha = this.progress / 0.1;
      } else if (this.progress > 0.9) {
        alpha = (1 - this.progress) / 0.1;
      }
      
      // Glow trail draw
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
      ctx.globalAlpha = alpha * 0.8;
      ctx.fill();
      
      // Reset canvas configurations
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;
    }
  }

  // Populate particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new FlowParticle());
  }

  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => isVisible = e.isIntersecting);
  });
  observer.observe(canvas);

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    // Draw dark overlay to create dynamic motion trails
    ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
    ctx.fillRect(0, 0, width, height);

    // Draw static connection paths (extremely faint)
    paths.forEach(path => {
      ctx.beginPath();
      for (let t = 0; t <= 100; t++) {
        const pos = path(t / 100);
        if (t === 0) ctx.moveTo(pos.x, pos.y);
        else ctx.lineTo(pos.x, pos.y);
      }
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Update and draw glowing flow particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });
  }
  animate();

  window.addEventListener('resize', () => {
    if (!canvas) return;
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;
  });
}

// 3. Mobile Phone bars scroll reveal growth
function initMobileChartAnimation() {
  const chartBars = document.querySelectorAll('.chart-bar');
  if (chartBars.length === 0) return;

  gsap.set(chartBars, { scaleY: 0, transformOrigin: 'bottom' });

  ScrollTrigger.create({
    trigger: '#service-mobile',
    start: 'top 65%',
    onEnter: () => {
      chartBars.forEach((bar, index) => {
        const targetHeight = bar.style.height || '50%';
        gsap.to(bar, {
          scaleY: parseFloat(targetHeight) / 100,
          duration: 1.4,
          delay: index * 0.1,
          ease: 'power4.out'
        });
      });
    },
    onLeaveBack: () => {
      gsap.to(chartBars, {
        scaleY: 0,
        duration: 0.5,
        ease: 'power2.in'
      });
    }
  });
}
