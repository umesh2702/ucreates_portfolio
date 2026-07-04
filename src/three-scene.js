import * as THREE from 'three';

export function initThreeScene() {
  const container = document.getElementById('hero-canvas');
  if (!container) return;

  // 1. Scene Setup
  const scene = new THREE.Scene();
  
  // 2. Camera Setup
  const width = container.clientWidth;
  const height = container.clientHeight;
  const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.z = 6.2;

  // 3. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "high-performance"
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // 4. Custom Viscous Liquid Chrome Shaders
  const vertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vEye;
    varying float vNoise;

    // Slow organic fluid wave displacement math (viscous mercury fluid simulation)
    void main() {
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      
      // Multi-frequency sine ripples (slow, deep wave velocities)
      float wave1 = sin(pos.x * 1.2 + uTime * 0.4) * cos(pos.y * 1.2 + uTime * 0.4) * sin(pos.z * 1.2 + uTime * 0.4);
      float wave2 = sin(pos.y * 2.5 - uTime * 0.7) * cos(pos.z * 2.5 - uTime * 0.6) * 0.25;
      
      // Mouse push coordinates influence
      float distFromMouse = length(uMouse);
      float mouseInfluence = 0.15 + distFromMouse * 0.3;
      
      // Viscous amplitude - reduced to keep the sphere sleek and luxurious
      float displacement = (wave1 + wave2) * mouseInfluence;
      vNoise = displacement;
      
      pos += normal * displacement * 0.20; // Refined thickness
      
      vPosition = pos;
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vEye = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorBlue;
    uniform vec3 uColorPurple;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vEye;
    varying float vNoise;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 eye = normalize(vEye);
      
      // Fresnel reflection factor
      float fresnel = pow(1.0 - max(dot(normal, eye), 0.0), 3.0);
      
      // Fake environment studio reflection
      float reflection = dot(normal, vec3(0.0, 1.0, 0.0)) * 0.5 + 0.5;
      float reflectionSide = dot(normal, vec3(1.0, 0.0, -1.0)) * 0.5 + 0.5;
      
      // Specular reflections: extremely sharp, high-end studio lighting
      vec3 lightDir = normalize(vec3(4.0, 6.0, 5.0));
      vec3 halfVector = normalize(lightDir + eye);
      float spec = pow(max(dot(normal, halfVector), 0.0), 80.0); // Sharpened specular (Apple level)
      
      // Deep charcoal metal color base
      vec3 baseChrome = vec3(0.04, 0.04, 0.05) 
                      + vec3(reflection * 0.12) 
                      + vec3(reflectionSide * 0.08);
                      
      // Bright white light highlight reflection
      baseChrome += vec3(spec * 0.85);
      
      // Glow colors (blended blue and purple accents at edge contours)
      vec3 edgeGlowColor = mix(uColorBlue, uColorPurple, reflectionSide + vNoise * 0.1);
      
      // Blend base metal with edge glow based on Fresnel factor
      vec3 finalColor = mix(baseChrome, edgeGlowColor, fresnel * 0.70);
      
      // Faint color highlights on facing specs
      finalColor += uColorBlue * spec * 0.12;
      
      gl_FragColor = vec4(finalColor, 0.98);
    }
  `;

  // 5. Geometry & Material Construction
  const geometry = new THREE.IcosahedronGeometry(2.0, 64);
  
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uColorBlue: { value: new THREE.Color('#0052ff') },
      uColorPurple: { value: new THREE.Color('#8a2be2') }
    },
    transparent: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 6. Mouse Interaction Interpolations
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // 7. Visibility Observer (saves resources)
  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
    });
  }, { threshold: 0.1 });
  observer.observe(container);

  // 8. Animation loop
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;
    
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;
    
    // Very smooth, slow mouse follow logic
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    
    material.uniforms.uMouse.value.set(mouse.x, mouse.y);
    
    // Viscous rotation
    mesh.rotation.y = elapsedTime * 0.05;
    mesh.rotation.x = elapsedTime * 0.03;
    
    // Subtle mesh slide positioning
    mesh.position.x = mouse.x * 0.35;
    mesh.position.y = mouse.y * 0.25;
    
    // Camera parallax reaction
    camera.position.x = -mouse.x * 0.3;
    camera.position.y = -mouse.y * 0.25;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
  }
  
  animate();

  // 9. Resize Event
  window.addEventListener('resize', () => {
    const newWidth = container.clientWidth;
    const newHeight = container.clientHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, newHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });
}
