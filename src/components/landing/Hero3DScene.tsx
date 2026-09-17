import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 750;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

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

    // --- Create High-Res Gradient Texture for the Glossy Ribbon ---
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Elegant futuristic SaaS gradient: White -> Cyan -> Teal -> Indigo/Purple -> Subtle Pink
      const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
      gradient.addColorStop(0.0, '#ffffff');      // Glossy pearl white
      gradient.addColorStop(0.2, '#cffafe');      // Soft ice cyan
      gradient.addColorStop(0.38, '#06b6d4');     // Electric cyan
      gradient.addColorStop(0.55, '#0d9488');     // Premium deep teal
      gradient.addColorStop(0.72, '#6366f1');     // Royal indigo
      gradient.addColorStop(0.86, '#a855f7');     // Vibrant violet
      gradient.addColorStop(0.96, '#f472b6');     // Soft champagne pink
      gradient.addColorStop(1.0, '#ffffff');      // Seamless blend
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);

      // Subtle fine iridescent diagonal wave bands
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.18)' : 'rgba(34, 211, 238, 0.12)';
        ctx.beginPath();
        ctx.ellipse(512, 128 * i, 600, 80, (i * Math.PI) / 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const ribbonTexture = new THREE.CanvasTexture(canvas);
    ribbonTexture.wrapS = THREE.RepeatWrapping;
    ribbonTexture.wrapT = THREE.RepeatWrapping;
    ribbonTexture.repeat.set(2, 1);

    // --- Environment / Studio Reflection Map for High-End Glass/Gloss Effect ---
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 512;
    envCanvas.height = 256;
    const envCtx = envCanvas.getContext('2d');
    if (envCtx) {
      const bgGrad = envCtx.createLinearGradient(0, 0, 0, 256);
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.4, '#e0f2fe');
      bgGrad.addColorStop(0.7, '#f3e8ff');
      bgGrad.addColorStop(1, '#ffffff');
      envCtx.fillStyle = bgGrad;
      envCtx.fillRect(0, 0, 512, 256);

      // Bright soft light boxes
      envCtx.fillStyle = '#ffffff';
      envCtx.fillRect(50, 40, 140, 90);
      envCtx.fillStyle = '#bae6fd';
      envCtx.fillRect(320, 30, 150, 100);
      envCtx.fillStyle = '#fbcfe8';
      envCtx.fillRect(180, 150, 160, 60);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // --- Main 3D Abstract Object: Organic Twisted Ribbon Torus Knot ---
    // p=2, q=3 creates the iconic flowing infinity-like ribbon geometry
    const geometry = new THREE.TorusKnotGeometry(2.35, 0.68, 256, 54, 2, 3);

    // High-quality glossy PBR material with realistic reflections & clearcoat
    const material = new THREE.MeshPhysicalMaterial({
      map: ribbonTexture,
      roughness: 0.16,
      metalness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
      ior: 1.45,
      transmission: 0.18, // subtle crystal depth
      thickness: 0.6,
      sheen: 0.7,
      sheenRoughness: 0.25,
      sheenColor: new THREE.Color('#e0f2fe'),
      envMapIntensity: 1.4,
      wireframe: false
    });

    const ribbonMesh = new THREE.Mesh(geometry, material);
    scene.add(ribbonMesh);

    // --- Complementary Floating Inner Orbital Ribbon Ring ---
    const orbitGeometry = new THREE.TorusGeometry(3.6, 0.045, 32, 120);
    const orbitMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#38bdf8'),
      emissive: new THREE.Color('#06b6d4'),
      emissiveIntensity: 0.5,
      roughness: 0.2,
      metalness: 0.8,
      transparent: true,
      opacity: 0.4
    });
    const orbitMesh = new THREE.Mesh(orbitGeometry, orbitMaterial);
    orbitMesh.rotation.x = Math.PI / 3;
    scene.add(orbitMesh);

    // Secondary subtle floating thin ring for orbital SaaS depth
    const ring2Geo = new THREE.TorusGeometry(4.2, 0.025, 24, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#c084fc'),
      emissive: new THREE.Color('#a855f7'),
      emissiveIntensity: 0.4,
      roughness: 0.25,
      metalness: 0.9,
      transparent: true,
      opacity: 0.3
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.y = Math.PI / 4;
    ring2Mesh.rotation.x = -Math.PI / 5;
    scene.add(ring2Mesh);

    // --- Studio Cinematic Lighting System ---
    // Ambient light: soft, clean, bright baseline
    const ambientLight = new THREE.AmbientLight(0xf0f9ff, 1.4);
    scene.add(ambientLight);

    // Key Light: Upper right bright white-cyan directional light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    // Fill Light: Soft cyan/teal light from bottom-left
    const fillLight = new THREE.DirectionalLight(0x22d3ee, 1.8);
    fillLight.position.set(-6, -4, 4);
    scene.add(fillLight);

    // Rim Light: Vivid purple light from behind for silhouette depth
    const rimLight = new THREE.DirectionalLight(0xa855f7, 2.2);
    rimLight.position.set(0, 5, -7);
    scene.add(rimLight);

    // Accent Point Light: Soft champagne pink specular highlight
    const pinkAccentLight = new THREE.PointLight(0xf472b6, 2.5, 15);
    pinkAccentLight.position.set(4, -3, 3);
    scene.add(pinkAccentLight);

    // Cyan Accent Point Light: Highlighting the front loop
    const cyanAccentLight = new THREE.PointLight(0x06b6d4, 2.2, 15);
    cyanAccentLight.position.set(-3, 4, 3);
    scene.add(cyanAccentLight);

    // --- Interactive Gentle Mouse Parallax ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      targetMouseX = (e.clientX - innerWidth / 2) / innerWidth;
      targetMouseY = (e.clientY - innerHeight / 2) / innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // --- Responsive Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 750;

      camera.aspect = newWidth / newHeight;
      // Adjust camera distance based on screen width so it's always perfectly framed
      if (newWidth < 640) {
        camera.position.z = 11.0; // Mobile zoom
      } else if (newWidth < 1024) {
        camera.position.z = 9.8;
      } else {
        camera.position.z = 8.6;
      }
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    // --- 60 FPS Continuous Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // 1. Continuous smooth 360° rotation around vertical axis (Y)
      // Slow, elegant, perfectly seamless infinite loop without sudden jumps
      ribbonMesh.rotation.y += 0.0055;

      // 2. Dynamic tilt on X & Z so different sides, inner curves & top/bottom angles are clearly visible
      ribbonMesh.rotation.x = Math.sin(elapsedTime * 0.42) * 0.24 + 0.18 + mouseY * 0.25;
      ribbonMesh.rotation.z = Math.cos(elapsedTime * 0.35) * 0.16 + mouseX * 0.25;

      // 3. Continuous gentle floating bobbing motion
      ribbonMesh.position.y = Math.sin(elapsedTime * 0.75) * 0.32;
      ribbonMesh.position.x = Math.cos(elapsedTime * 0.5) * 0.15;

      // 4. Harmonic rotation of orbital rings
      orbitMesh.rotation.z -= 0.003;
      orbitMesh.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.15;
      orbitMesh.position.y = ribbonMesh.position.y * 0.7;

      ring2Mesh.rotation.z += 0.002;
      ring2Mesh.rotation.y += 0.0035;
      ring2Mesh.position.y = ribbonMesh.position.y * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup on unmount ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      ribbonTexture.dispose();
      envTexture.dispose();
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden flex items-center justify-center select-none"
      style={{
        maskImage: 'radial-gradient(circle at 50% 48%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 70%, transparent 95%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 48%, rgba(0,0,0,1) 45%, rgba(0,0,0,0.85) 70%, transparent 95%)'
      }}
    />
  );
};
