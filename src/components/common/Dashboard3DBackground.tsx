import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useApp } from '../../context/AppContext';

export const Dashboard3DBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeTab, domain } = useApp();

  // Determine current active domain for light accent tint
  let currentDomain = domain;
  if (activeTab === 'healthcare-dashboard') currentDomain = 'healthcare';
  else if (activeTab === 'disaster-dashboard') currentDomain = 'disaster';
  else if (activeTab === 'education-dashboard') currentDomain = 'education';

  // Accent colors per domain
  const domainLightColors: Record<string, number> = {
    healthcare: 0x06b6d4, // Cyan
    disaster: 0xf59e0b,   // Amber
    education: 0xa855f7,  // Violet/Purple
    activity: 0x3b82f6    // Blue
  };

  const currentAccent = activeTab === 'activity-dashboard'
    ? domainLightColors.activity
    : (domainLightColors[currentDomain] || domainLightColors.healthcare);

  const accentColorRef = useRef<number>(currentAccent);
  useEffect(() => {
    accentColorRef.current = currentAccent;
  }, [currentAccent]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // --- Procedural Reflection Environment Map ---
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      const bgGrad = envCtx.createLinearGradient(0, 0, 0, 256);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.35, '#e0f2fe');
      bgGrad.addColorStop(0.7, '#ede9fe');
      bgGrad.addColorStop(1, '#ffffff');
      envCtx.fillStyle = bgGrad;
      envCtx.fillRect(0, 0, 512, 256);

      // Soft light boxes for specular reflections
      envCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      envCtx.fillRect(40, 30, 160, 90);
      envCtx.fillStyle = 'rgba(186, 230, 253, 0.7)';
      envCtx.fillRect(300, 60, 170, 110);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    // --- High-End Translucent Frosted Glass Materials ---
    // Primary glossy glass material for large objects
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xf0f9ff),
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.08,
      metalness: 0.12,
      roughness: 0.22,
      transmission: 0.86,
      thickness: 1.4,
      ior: 1.46,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      envMap: envTexture,
      envMapIntensity: 1.25,
      transparent: true,
      opacity: 0.82
    });

    // Sleek holographic glass material for orbital rings & secondary facets
    const crystalMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xe0f2fe),
      emissive: new THREE.Color(0x38bdf8),
      emissiveIntensity: 0.12,
      metalness: 0.08,
      roughness: 0.16,
      transmission: 0.88,
      thickness: 1.8,
      ior: 1.52,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMap: envTexture,
      envMapIntensity: 1.4,
      transparent: true,
      opacity: 0.78
    });

    // Wireframe glow ring material
    const ringMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x38bdf8),
      emissive: new THREE.Color(0x0284c7),
      emissiveIntensity: 0.4,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.55
    });

    // --- Object 1: Primary Futuristic Command Core (Right Side Depth) ---
    // TorusKnot with smooth continuous 360° rotation & multi-axis float
    const coreGroup = new THREE.Group();
    coreGroup.position.set(3.6, 0.4, -0.8);

    const knotGeometry = new THREE.TorusKnotGeometry(1.65, 0.42, 140, 32, 2, 3);
    const coreKnot = new THREE.Mesh(knotGeometry, glassMaterial);
    coreGroup.add(coreKnot);

    // Orbital Gyroscope Ring around core
    const ringGeo1 = new THREE.TorusGeometry(2.4, 0.035, 16, 90);
    const coreRing = new THREE.Mesh(ringGeo1, ringMaterial);
    coreRing.rotation.x = Math.PI / 3;
    coreGroup.add(coreRing);

    scene.add(coreGroup);

    // --- Object 2: Faceted AI Quantum Crystal (Left Midground) ---
    // Translucent faceted icosahedron catching moving reflections
    const crystalGroup = new THREE.Group();
    crystalGroup.position.set(-4.0, -0.6, 0.4);

    const icosaGeometry = new THREE.IcosahedronGeometry(1.35, 0);
    const crystalMesh = new THREE.Mesh(icosaGeometry, crystalMaterial);
    crystalGroup.add(crystalMesh);

    // Orbital ring around crystal
    const ringGeo2 = new THREE.TorusGeometry(1.85, 0.028, 16, 80);
    const crystalRing = new THREE.Mesh(ringGeo2, ringMaterial);
    crystalRing.rotation.y = Math.PI / 4;
    crystalGroup.add(crystalRing);

    scene.add(crystalGroup);

    // --- Object 3: Command Center Dual Gyroscope (Top Right Depth) ---
    const gyroGroup = new THREE.Group();
    gyroGroup.position.set(1.6, 3.2, -3.2);

    const gyroRingOuter = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.06, 16, 72), crystalMaterial);
    const gyroRingInner = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.05, 16, 72), ringMaterial);
    gyroRingInner.rotation.x = Math.PI / 2.5;
    gyroGroup.add(gyroRingOuter);
    gyroGroup.add(gyroRingInner);

    scene.add(gyroGroup);

    // --- Object 4: Floating Octahedron Node (Lower Left Center) ---
    const octaGroup = new THREE.Group();
    octaGroup.position.set(-1.8, -2.6, -1.8);
    const octaMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.95, 0), glassMaterial);
    octaGroup.add(octaMesh);
    scene.add(octaGroup);

    // --- Parallax Floating Micro-Nodes at Varying Depths ---
    interface FloatingNode {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      rotSpeedX: number;
      rotSpeedY: number;
      rotSpeedZ: number;
      floatSpeed: number;
      floatOffset: number;
      floatRange: number;
    }

    const floatingNodes: FloatingNode[] = [];
    const nodeGeometries = [
      new THREE.IcosahedronGeometry(0.35, 0),
      new THREE.OctahedronGeometry(0.38, 0),
      new THREE.TetrahedronGeometry(0.32, 0)
    ];

    const nodePositions = [
      { x: -5.2, y: 2.8, z: -2.5 },
      { x: -2.8, y: 3.5, z: -4.0 },
      { x: 0.5, y: -3.2, z: -1.5 },
      { x: 5.2, y: -2.4, z: -2.0 },
      { x: 4.8, y: 3.0, z: -4.5 },
      { x: -0.8, y: 2.2, z: -5.0 },
      { x: 3.0, y: -1.8, z: -3.0 }
    ];

    nodePositions.forEach((pos, idx) => {
      const geo = nodeGeometries[idx % nodeGeometries.length];
      const mesh = new THREE.Mesh(geo, crystalMaterial);
      mesh.position.set(pos.x, pos.y, pos.z);
      scene.add(mesh);

      floatingNodes.push({
        mesh,
        baseX: pos.x,
        baseY: pos.y,
        baseZ: pos.z,
        rotSpeedX: 0.006 * (idx % 2 === 0 ? 1 : -1),
        rotSpeedY: 0.008 * (idx % 3 === 0 ? 1 : -1),
        rotSpeedZ: 0.004 * (idx % 2 === 0 ? -1 : 1),
        floatSpeed: 0.6 + (idx * 0.12),
        floatOffset: idx * 1.1,
        floatRange: 0.25 + (idx % 3) * 0.08
      });
    });

    // --- Cinematic Lights: Soft, Moving, and Atmospheric ---
    // Ambient light: Soft white for clear, bright SaaS visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.45);
    scene.add(ambientLight);

    // Directional Key Light from upper-left
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(-6, 8, 8);
    scene.add(dirLight);

    // Moving Key Point Light 1: Cyan / Ice-Blue (Orbits 3D objects, creating gliding reflections)
    const movingLight1 = new THREE.PointLight(0x22d3ee, 2.6, 25);
    scene.add(movingLight1);

    // Moving Accent Point Light 2: Dynamically tinted by current domain
    const movingLight2 = new THREE.PointLight(accentColorRef.current, 2.2, 25);
    scene.add(movingLight2);

    // Gentle fill light
    const fillLight = new THREE.PointLight(0x818cf8, 1.2, 20);
    fillLight.position.set(0, -6, 4);
    scene.add(fillLight);

    // --- Mouse Parallax Tracking ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = ((e.clientX / innerWidth) - 0.5) * 1.2;
      targetMouseY = ((e.clientY / innerHeight) - 0.5) * 0.8;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // --- Continuous 60 FPS Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerping for natural camera parallax
      mouseX += (targetMouseX - mouseX) * 0.035;
      mouseY += (targetMouseY - mouseY) * 0.035;
      camera.position.x = mouseX * 0.9;
      camera.position.y = -mouseY * 0.7;
      camera.lookAt(0, 0, 0);

      // Update dynamic domain accent color smoothly
      if (movingLight2.color.getHex() !== accentColorRef.current) {
        movingLight2.color.lerp(new THREE.Color(accentColorRef.current), 0.05);
      }

      // 1. Core Object: 360° Continuous Rotation + Multi-Axis Floating
      coreKnot.rotation.y = elapsedTime * 0.28; // Continuous 360° rotation around vertical axis
      coreKnot.rotation.x = Math.sin(elapsedTime * 0.35) * 0.35; // Gentle X tilt
      coreKnot.rotation.z = Math.cos(elapsedTime * 0.25) * 0.25; // Gentle Z tilt
      coreGroup.position.y = 0.4 + Math.sin(elapsedTime * 0.55) * 0.32; // Smooth floating movement
      coreGroup.position.x = 3.6 + Math.cos(elapsedTime * 0.45) * 0.22;

      // Gyroscope Ring around Core
      coreRing.rotation.z = -elapsedTime * 0.22;
      coreRing.rotation.y = Math.sin(elapsedTime * 0.4) * 0.45;

      // 2. Crystal Object: Multi-Axis Rotation + Opposite Float Phase
      crystalMesh.rotation.y = elapsedTime * 0.35;
      crystalMesh.rotation.x = elapsedTime * 0.22;
      crystalMesh.rotation.z = Math.sin(elapsedTime * 0.3) * 0.28;
      crystalGroup.position.y = -0.6 + Math.sin(elapsedTime * 0.5 + 2.0) * 0.35;
      crystalGroup.position.x = -4.0 + Math.cos(elapsedTime * 0.4 + 1.5) * 0.25;
      crystalRing.rotation.x = elapsedTime * 0.28;
      crystalRing.rotation.z = -elapsedTime * 0.18;

      // 3. Top Gyroscope Rings: Counter-Rotating Gyroscopic Motion
      gyroRingOuter.rotation.x = elapsedTime * 0.32;
      gyroRingOuter.rotation.y = elapsedTime * 0.24;
      gyroRingInner.rotation.y = -elapsedTime * 0.38;
      gyroRingInner.rotation.z = elapsedTime * 0.26;
      gyroGroup.position.y = 3.2 + Math.sin(elapsedTime * 0.45 + 1.0) * 0.28;

      // 4. Octahedron Node: Smooth Tumbling Motion
      octaMesh.rotation.x = elapsedTime * 0.3;
      octaMesh.rotation.y = -elapsedTime * 0.36;
      octaMesh.rotation.z = Math.cos(elapsedTime * 0.4) * 0.3;
      octaGroup.position.y = -2.6 + Math.sin(elapsedTime * 0.6 + 3.0) * 0.3;

      // 5. Parallax Floating Micro-Nodes: Independent Floats & Spins
      floatingNodes.forEach(node => {
        node.mesh.rotation.x += node.rotSpeedX;
        node.mesh.rotation.y += node.rotSpeedY;
        node.mesh.rotation.z += node.rotSpeedZ;
        node.mesh.position.y = node.baseY + Math.sin(elapsedTime * node.floatSpeed + node.floatOffset) * node.floatRange;
        node.mesh.position.x = node.baseX + Math.cos(elapsedTime * (node.floatSpeed * 0.8) + node.floatOffset) * (node.floatRange * 0.6);
      });

      // 6. Moving Dynamic Lights: Orbiting around objects to cast shifting reflections & glints
      movingLight1.position.x = Math.sin(elapsedTime * 0.5) * 6.5;
      movingLight1.position.y = Math.cos(elapsedTime * 0.4) * 4.5;
      movingLight1.position.z = Math.sin(elapsedTime * 0.3) * 4.0 + 3.0;

      movingLight2.position.x = Math.cos(elapsedTime * 0.45 + 1.5) * 6.0;
      movingLight2.position.y = Math.sin(elapsedTime * 0.55 + 2.0) * 4.0;
      movingLight2.position.z = Math.cos(elapsedTime * 0.35) * 3.5 + 2.5;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup on Unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose geometries, materials, and textures
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      envTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
      style={{
        pointerEvents: 'none',
        opacity: 0.88
      }}
    />
  );
};
