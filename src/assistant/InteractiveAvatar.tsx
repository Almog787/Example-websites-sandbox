import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EmotionalState } from './types';

interface InteractiveAvatarProps {
  emotionalState?: EmotionalState;
  size?: number;
  className?: string;
  isTrigger?: boolean;
}

export const InteractiveAvatar: React.FC<InteractiveAvatarProps> = ({
  emotionalState = 'idle',
  size = 56,
  className = '',
  isTrigger = false
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Mouse & Animation State References
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isBlinkingRef = useRef<boolean>(false);
  const actionStartTimeRef = useRef<number | null>(null);
  
  // Extended state tracking
  const stateRef = useRef({
    emotion: emotionalState,
    isSleeping: false,
    scrollVelocity: 0,
    exitIntent: false,
    nodding: false
  });

  // Catch emotional state changes to trigger one-shot animations
  useEffect(() => {
    if (stateRef.current.emotion !== emotionalState) {
      if (['happy', 'success', 'shake'].includes(emotionalState)) {
        actionStartTimeRef.current = Date.now();
      }
      stateRef.current.emotion = emotionalState;
    }
  }, [emotionalState]);

  // Global mouse tracking, Sleep Mode Timer, and Exit Intent
  useEffect(() => {
    let sleepTimer: NodeJS.Timeout;

    const resetSleepTimer = () => {
      stateRef.current.isSleeping = false;
      clearTimeout(sleepTimer);
      // 45 seconds to sleep, using 45000
      sleepTimer = setTimeout(() => {
        stateRef.current.isSleeping = true;
      }, 45000);
    };

    const handleMouseMove = (e: MouseEvent) => {
      resetSleepTimer();
      stateRef.current.exitIntent = false; // Cancel panic on mouse move

      if (!mountRef.current) return;
      
      // CTA Tracking Simulation: If hovering over a button/link, snap gaze slightly more deliberately
      const target = e.target as HTMLElement;
      const isCTA = target.closest('button, a, input, [role="button"]');

      const rect = mountRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized mouse delta (-1 to 1)
      let nx = (e.clientX - centerX) / (window.innerWidth / 2);
      let ny = (e.clientY - centerY) / (window.innerHeight / 2);

      if (isCTA) {
        nx *= 1.4; // Exaggerate gaze towards actionable items
        ny *= 1.4;
      }

      mouseRef.current = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny))
      };
    };

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10) { // Mouse left from the top (Exit Intent)
        stateRef.current.exitIntent = true;
        actionStartTimeRef.current = Date.now(); // Trigger panic animation timing
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    resetSleepTimer();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(sleepTimer);
    };
  }, []);

  // Scroll Velocity (Wind effect) and Bottom Nod
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const delta = currentScrollY - lastScrollY;
          
          // Smoothly update scroll velocity
          stateRef.current.scrollVelocity = delta * 0.05; 
          lastScrollY = currentScrollY;

          // Check if reached bottom for "Nod"
          if ((window.innerHeight + currentScrollY) >= document.body.offsetHeight - 50) {
            if (!stateRef.current.nodding) {
              stateRef.current.nodding = true;
              actionStartTimeRef.current = Date.now(); // Re-use action timer for nod
              setTimeout(() => { stateRef.current.nodding = false; }, 1000);
            }
          }

          // Reset sleep timer on scroll too
          stateRef.current.isSleeping = false;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Decay scroll velocity over time so it returns to 0
    const velocityDecay = setInterval(() => {
      stateRef.current.scrollVelocity *= 0.9;
    }, 50);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(velocityDecay);
    };
  }, []);

  // Natural Random Blinking Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const triggerBlink = () => {
      if (!stateRef.current.isSleeping) {
        isBlinkingRef.current = true;
        setTimeout(() => {
          isBlinkingRef.current = false;
        }, 150);
      }
      const nextInterval = 3000 + Math.random() * 3000;
      timer = setTimeout(triggerBlink, nextInterval);
    };

    timer = setTimeout(triggerBlink, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Three.js 3D Calc-E Robot Setup
  useEffect(() => {
    if (!canvasRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;

    try {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 4.2);

      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(size, size);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
    } catch {
      setWebglSupported(false);
      return;
    }

    // --- HIGH-CONTRAST LIGHTING SETUP ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    // Cyan Key Light
    const cyanLight = new THREE.DirectionalLight(0x00f0ff, 3.0);
    cyanLight.position.set(3, 4, 5);
    scene.add(cyanLight);

    // Warm Gold Fill Light
    const goldLight = new THREE.PointLight(0xf59e0b, 2.5, 10);
    goldLight.position.set(-3, -2, 3);
    scene.add(goldLight);

    // Panic/Alert Light (Hidden by default)
    const alertLight = new THREE.PointLight(0xff0000, 0, 10);
    alertLight.position.set(0, 0, 4);
    scene.add(alertLight);

    // --- CALC-E 3D ROBOT HEAD MESHES ---
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const headGroup = new THREE.Group();
    rootGroup.add(headGroup);

    // 1. Central Head Base
    const headGeo = new THREE.SphereGeometry(1.0, 32, 32);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.7,
      roughness: 0.15,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35
    });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headGroup.add(headMesh);

    // 2. Glass Sheen Outer Helmet
    const helmetGeo = new THREE.SphereGeometry(1.15, 32, 32);
    const helmetMat = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.28,
      roughness: 0.05,
      metalness: 0.2,
      transmission: 0.7,
      ior: 1.3
    });
    const helmetMesh = new THREE.Mesh(helmetGeo, helmetMat);
    headGroup.add(helmetMesh);

    // 3. Dark Visor Screen
    const visorGeo = new THREE.SphereGeometry(0.88, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.55);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x090d16,
      metalness: 0.9,
      roughness: 0.05,
      emissive: 0x0284c7,
      emissiveIntensity: 0.25
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.x = Math.PI / 2;
    visorMesh.position.set(0, 0, 0.18);
    headGroup.add(visorMesh);

    // 4. Glowing Gold Neck Ring
    const neckGeo = new THREE.TorusGeometry(0.72, 0.08, 16, 32);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.9,
      roughness: 0.1,
      emissive: 0xd97706,
      emissiveIntensity: 0.3
    });
    const neckMesh = new THREE.Mesh(neckGeo, goldMat);
    neckMesh.rotation.x = Math.PI / 2;
    neckMesh.position.set(0, -0.98, 0);
    headGroup.add(neckMesh);

    // 5. Antenna
    const antennaStemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16);
    const antennaStem = new THREE.Mesh(antennaStemGeo, goldMat);
    antennaStem.position.set(0, 1.15, 0);
    headGroup.add(antennaStem);

    const bulbGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xff007a,
      emissive: 0xff007a,
      emissiveIntensity: 2.0,
      roughness: 0.1
    });
    const antennaBulb = new THREE.Mesh(bulbGeo, bulbMat);
    antennaBulb.position.set(0, 1.38, 0);
    headGroup.add(antennaBulb);

    // 6. Eyes Group
    const eyesGroup = new THREE.Group();
    eyesGroup.position.set(0, 0.1, 0.82);
    headGroup.add(eyesGroup);

    const scleraMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
    const pupilMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x06b6d4,
      emissiveIntensity: 2.2,
      roughness: 0.05
    });
    const catchlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const createEye = (xPos: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 0, 0);
      
      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), scleraMat);
      eyeGroup.add(sclera);
      
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.13, 20, 20), pupilMat);
      pupil.position.set(0, 0, 0.1);
      eyeGroup.add(pupil);
      
      const catchlight = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), catchlightMat);
      catchlight.position.set(-0.04, 0.04, 0.2);
      eyeGroup.add(catchlight);
      
      return { group: eyeGroup, pupil };
    };

    const leftEye = createEye(-0.35);
    const rightEye = createEye(0.35);
    eyesGroup.add(leftEye.group);
    eyesGroup.add(rightEye.group);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const current = stateRef.current;

      // 1. Floating (Idle vs Sleep)
      if (!prefersReducedMotion) {
        if (current.isSleeping) {
          // Slow, deep breathing
          headGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12 - 0.05;
        } else {
          // Normal idle
          headGroup.position.y = Math.sin(elapsedTime * 2.2) * 0.08;
        }
      }

      // 2. Head Tracking & Wind Velocity
      let targetRotY = mouseRef.current.x * 0.35;
      let targetRotX = -mouseRef.current.y * 0.28;

      // Wind effect: tilt head backward when scrolling down fast
      if (current.scrollVelocity > 0.1) {
        targetRotX -= Math.min(current.scrollVelocity * 0.2, 0.5);
      } else if (current.scrollVelocity < -0.1) {
        targetRotX += Math.min(Math.abs(current.scrollVelocity) * 0.2, 0.5);
      }

      if (current.isSleeping) {
        targetRotY = 0; // Look forward when asleep
        targetRotX = -0.1; // Head slightly tilted down
      }

      headGroup.rotation.y += (targetRotY - headGroup.rotation.y) * 0.08;
      headGroup.rotation.x += (targetRotX - headGroup.rotation.x) * 0.08;

      // Pupil Lerp
      const pupilX = current.isSleeping ? 0 : mouseRef.current.x * 0.06;
      const pupilY = current.isSleeping ? 0 : -mouseRef.current.y * 0.05;
      
      leftEye.pupil.position.x += (pupilX - leftEye.pupil.position.x) * 0.12;
      leftEye.pupil.position.y += (pupilY - leftEye.pupil.position.y) * 0.12;
      rightEye.pupil.position.x += (pupilX - rightEye.pupil.position.x) * 0.12;
      rightEye.pupil.position.y += (pupilY - rightEye.pupil.position.y) * 0.12;

      // 3. Eye Blinking / Sleep Squint
      let targetScaleY = 1.0;
      if (current.isSleeping) {
        targetScaleY = 0.05; // Closed eyes
      } else if (isBlinkingRef.current) {
        targetScaleY = 0.08; // Blink
      } else if (current.exitIntent) {
        targetScaleY = 1.3; // Wide eyes panic
      }
      eyesGroup.scale.y += (targetScaleY - eyesGroup.scale.y) * (current.isSleeping ? 0.05 : 0.3);

      // 4. One-Shot & Special Animations
      if (current.exitIntent) {
        // Panic mode! Rapid shake and red light
        headGroup.rotation.z = Math.sin(elapsedTime * 25) * 0.05;
        alertLight.intensity = (Math.sin(elapsedTime * 10) + 1) * 2; // Pulsing red
        bulbMat.color.setHex(0xff0000);
        bulbMat.emissive.setHex(0xff0000);
      } else {
        alertLight.intensity = 0;
        bulbMat.color.setHex(0xff007a);
        bulbMat.emissive.setHex(0xff007a);

        if (current.nodding && actionStartTimeRef.current !== null) {
          // Bottom nod
          const delta = (Date.now() - actionStartTimeRef.current) / 1000;
          if (delta <= 0.6) {
            headGroup.rotation.x += Math.sin(delta * Math.PI * 3) * 0.15;
          }
        } else if (actionStartTimeRef.current !== null) {
          const delta = (Date.now() - actionStartTimeRef.current) / 1000;

          if (current.emotion === 'happy' || current.emotion === 'success') {
            const duration = 0.6;
            if (delta <= duration && !prefersReducedMotion) {
              const progress = delta / duration;
              headGroup.position.y += Math.sin(progress * Math.PI) * 0.45;
              headGroup.rotation.y += progress * Math.PI * 2; // Spin
            } else {
              actionStartTimeRef.current = null;
            }
          } else if (current.emotion === 'shake') {
            const duration = 0.5;
            if (delta <= duration && !prefersReducedMotion) {
              const progress = delta / duration;
              headGroup.rotation.z = Math.sin(progress * Math.PI * 6) * 0.25;
            } else {
              actionStartTimeRef.current = null;
              headGroup.rotation.z = 0;
            }
          }
        }

        // Continuous Thinking Wiggle
        if (current.emotion === 'thinking' && actionStartTimeRef.current === null) {
          headGroup.rotation.z = Math.sin(elapsedTime * 9) * 0.12;
        } else if (actionStartTimeRef.current === null && current.emotion !== 'shake' && !current.exitIntent) {
          headGroup.rotation.z += (0 - headGroup.rotation.z) * 0.1;
        }
      }

      // Pulse antenna bulb
      antennaBulb.scale.setScalar(1.0 + Math.sin(elapsedTime * 4) * (current.exitIntent ? 0.3 : 0.15));

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      headGeo.dispose(); headMat.dispose(); helmetGeo.dispose(); helmetMat.dispose();
      visorGeo.dispose(); visorMat.dispose(); neckGeo.dispose(); goldMat.dispose();
      antennaStemGeo.dispose(); bulbGeo.dispose(); bulbMat.dispose();
      scleraMat.dispose(); pupilMat.dispose(); catchlightMat.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="w-full h-full object-contain pointer-events-none drop-shadow-[0_4px_20px_rgba(6,182,212,0.6)]"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-cyan-950 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 font-bold text-xs">
          🤖
        </div>
      )}

      {isTrigger && (
        <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-35 pointer-events-none" />
      )}
    </div>
  );
};
