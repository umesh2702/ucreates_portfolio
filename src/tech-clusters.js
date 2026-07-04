export function initTechClusters() {
  const container = document.getElementById('tech-canvas-container');
  if (!container) return;

  container.innerHTML = '<canvas id="tech-canvas" style="width: 100%; height: 100%;"></canvas>';
  const canvas = document.getElementById('tech-canvas');
  const ctx = canvas.getContext('2d');

  let width = container.offsetWidth;
  let height = container.offsetHeight;
  canvas.width = width;
  canvas.height = height;

  // Aesthetic colors matching our soft lighting system
  const categories = {
    ai: { name: '01 // COGNITIVE INTEL', color: '#0052ff', x: width * 0.5, y: height * 0.3 },
    frontend: { name: '02 // INTERFACE SYSTEMS', color: '#ffffff', x: width * 0.25, y: height * 0.6 },
    backend: { name: '03 // ELITE BACKEND', color: '#8a2be2', x: width * 0.45, y: height * 0.75 },
    cloud: { name: '04 // EDGE INFRASTRUCTURE', color: '#ffffff', x: width * 0.75, y: height * 0.6 },
    automation: { name: '05 // AUTOMATED FLOWS', color: '#8a2be2', x: width * 0.7, y: height * 0.25 }
  };

  // Node structures (Clean abstract mesh vertices)
  const nodes = [
    // Hubs
    { id: 'h-ai', label: 'COGNITIVE ARCHITECTURE', isHub: true, category: 'ai', size: 4, x: categories.ai.x, y: categories.ai.y },
    { id: 'h-fe', label: 'PLATFORM INTERFACES', isHub: true, category: 'frontend', size: 4, x: categories.frontend.x, y: categories.frontend.y },
    { id: 'h-be', label: 'SYSTEM SERVICES', isHub: true, category: 'backend', size: 4, x: categories.backend.x, y: categories.backend.y },
    { id: 'h-cl', label: 'EDGE DISTRIBUTIONS', isHub: true, category: 'cloud', size: 4, x: categories.cloud.x, y: categories.cloud.y },
    { id: 'h-au', label: 'INTELLIGENT PIPELINES', isHub: true, category: 'automation', size: 4, x: categories.automation.x, y: categories.automation.y },
    
    // Satellite Vertices (reveal detailed descriptions on hover)
    { parent: 'h-ai', label: 'LLM Routing Agent', isHub: false, category: 'ai', size: 2 },
    { parent: 'h-ai', label: 'Semantic Search VectorDB', isHub: false, category: 'ai', size: 2 },
    { parent: 'h-ai', label: 'Neural Token Embeddings', isHub: false, category: 'ai', size: 2 },
    { parent: 'h-ai', label: 'Recursive Agent Orchestration', isHub: false, category: 'ai', size: 2 },
    
    { parent: 'h-fe', label: 'Sub-100ms Page Interactive', isHub: false, category: 'frontend', size: 2 },
    { parent: 'h-fe', label: 'React / Next.js Frameworks', isHub: false, category: 'frontend', size: 2 },
    { parent: 'h-fe', label: 'Rigorous Fluid Layout Systems', isHub: false, category: 'frontend', size: 2 },
    { parent: 'h-fe', label: 'Tailwind / Vanilla CSS Architect', isHub: false, category: 'frontend', size: 2 },
    
    { parent: 'h-be', label: 'Compiled Rust Backends', isHub: false, category: 'backend', size: 2 },
    { parent: 'h-be', label: 'Secure Transaction Ledgers', isHub: false, category: 'backend', size: 2 },
    { parent: 'h-be', label: 'Relational PostgreSQL Structures', isHub: false, category: 'backend', size: 2 },
    { parent: 'h-be', label: 'GraphQL API Gateways', isHub: false, category: 'backend', size: 2 },

    { parent: 'h-cl', label: 'Cloudflare Edge Networks', isHub: false, category: 'cloud', size: 2 },
    { parent: 'h-cl', label: 'Docker Container Clusters', isHub: false, category: 'cloud', size: 2 },
    { parent: 'h-cl', label: 'Vercel Deployment Pipelines', isHub: false, category: 'cloud', size: 2 },
    { parent: 'h-cl', label: 'AWS Load Balancers', isHub: false, category: 'cloud', size: 2 },
    
    { parent: 'h-au', label: 'Pipeline Event Listeners', isHub: false, category: 'automation', size: 2 },
    { parent: 'h-au', label: 'N8N System Connections', isHub: false, category: 'automation', size: 2 },
    { parent: 'h-au', label: 'Automated Sync Cron Engines', isHub: false, category: 'automation', size: 2 }
  ];

  // Distribute satellites
  nodes.forEach(node => {
    node.vx = 0;
    node.vy = 0;
    node.hover = false;
    
    if (!node.isHub) {
      const parentHub = nodes.find(h => h.id === node.parent);
      const angle = Math.random() * Math.PI * 2;
      const radius = 50 + Math.random() * 30;
      node.x = parentHub.x + Math.cos(angle) * radius;
      node.y = parentHub.y + Math.sin(angle) * radius;
    }
  });

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

  let isVisible = false;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => isVisible = e.isIntersecting);
  });
  observer.observe(canvas);

  function tick() {
    requestAnimationFrame(tick);
    if (!isVisible) return;

    updatePhysics();
    drawMesh();
  }
  tick();

  function updatePhysics() {
    // 1. Hub anchors
    nodes.forEach(node => {
      if (node.isHub) {
        const target = categories[node.category];
        node.x += (target.x - node.x) * 0.04;
        node.y += (target.y - node.y) * 0.04;
      }
    });

    // 2. Physics forces
    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      nodeA.hover = false;

      if (mouse.active && mouse.x !== null) {
        const dx = nodeA.x - mouse.x;
        const dy = nodeA.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Hover bounds check
        if (dist < nodeA.size + 15) {
          nodeA.hover = true;
        }

        // Interactive elastic mouse push
        if (dist < 100) {
          const force = (100 - dist) / 100;
          nodeA.vx += (dx / dist) * force * 1.5;
          nodeA.vy += (dy / dist) * force * 1.5;
        }
      }

      // Repulsion between nodes
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue;
        const nodeB = nodes[j];

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const minDist = nodeA.size + nodeB.size + 40;
        if (dist < minDist) {
          const overlap = minDist - dist;
          const force = (overlap / minDist) * 0.6;
          nodeA.vx -= (dx / dist) * force;
          nodeA.vy -= (dy / dist) * force;
        }

        // Spring connection links
        if (!nodeA.isHub && nodeA.parent === nodeB.id) {
          const wireLen = 65;
          const diff = dist - wireLen;
          const spring = 0.005;
          nodeA.vx += (dx / dist) * diff * spring;
          nodeA.vy += (dy / dist) * diff * spring;
        }
      }

      const friction = 0.82;
      nodeA.x += nodeA.vx;
      nodeA.y += nodeA.vy;
      nodeA.vx *= friction;
      nodeA.vy *= friction;

      // Restrain coordinates
      const margin = 20;
      if (nodeA.x < margin) nodeA.x = margin;
      if (nodeA.x > width - margin) nodeA.x = width - margin;
      if (nodeA.y < margin) nodeA.y = margin;
      if (nodeA.y > height - margin) nodeA.y = height - margin;
    }
  }

  // Draw modern blueprint wireframe mesh
  function drawMesh() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw link connections
    nodes.forEach(node => {
      if (!node.isHub) {
        const parentHub = nodes.find(h => h.id === node.parent);
        const color = categories[node.category].color;
        
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(parentHub.x, parentHub.y);
        
        const isFocus = node.hover || parentHub.hover;
        ctx.strokeStyle = isFocus ? color : 'rgba(255, 255, 255, 0.035)';
        ctx.lineWidth = isFocus ? 1.0 : 0.6;
        ctx.stroke();
      }
    });

    // 2. Draw nodes & labels
    nodes.forEach(node => {
      const color = categories[node.category].color;

      // Draw faint dot circle outline (blueprint details look)
      if (node.isHub || node.hover) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size + 4, 0, Math.PI * 2);
        ctx.strokeStyle = node.hover ? color : 'rgba(255, 255, 255, 0.02)';
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = node.hover ? color : '#ffffff';
      ctx.fill();

      // Mini text coordinates/labels
      if (node.isHub) {
        // Hub Labels (Always visible in clean uppercase text)
        ctx.font = '500 9px Inter, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.letterSpacing = '1px';
        ctx.textAlign = 'left';
        ctx.fillText(node.label, node.x + 12, node.y + 3);
      } else if (node.hover) {
        // Satellite Capability (Shown only on hover)
        ctx.font = '400 9.5px Inter, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y - 12);
        
        // Draw decorative vector coordinate text
        ctx.font = '400 8px Courier, monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillText(`[${Math.round(node.x)}px, ${Math.round(node.y)}px]`, node.x, node.y + 16);
      }
    });
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    if (!container || !canvas) return;
    width = container.offsetWidth;
    height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    categories.ai.x = width * 0.5;          categories.ai.y = height * 0.3;
    categories.frontend.x = width * 0.25;   categories.frontend.y = height * 0.6;
    categories.backend.x = width * 0.45;    categories.backend.y = height * 0.75;
    categories.cloud.x = width * 0.75;      categories.cloud.y = height * 0.6;
    categories.automation.x = width * 0.7;  categories.automation.y = height * 0.25;
  });
}
