import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function HeroParticles() {
  const mountRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || prefersReducedMotion) return undefined;

    let frame = 0;
    let renderer;
    let cleanup = () => {};
    let cancelled = false;

    async function init() {
      const THREE = await import("three");
      if (cancelled || !mountRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.z = 8;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      mount.appendChild(renderer.domElement);

      const count = window.innerWidth < 768 ? 42 : 88;
      const positions = new Float32Array(count * 3);
      for (let index = 0; index < count; index += 1) {
        positions[index * 3] = (Math.random() - 0.5) * 10;
        positions[index * 3 + 1] = (Math.random() - 0.5) * 6;
        positions[index * 3 + 2] = (Math.random() - 0.5) * 5;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const material = new THREE.PointsMaterial({
        color: 0x93c5fd,
        size: 0.028,
        transparent: true,
        opacity: 0.72,
        depthWrite: false,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      const mouse = { x: 0, y: 0 };
      const resize = () => {
        const rect = mount.getBoundingClientRect();
        renderer.setSize(rect.width, rect.height, false);
        camera.aspect = rect.width / Math.max(rect.height, 1);
        camera.updateProjectionMatrix();
      };
      const pointer = (event) => {
        const rect = mount.getBoundingClientRect();
        mouse.x = (event.clientX - rect.left) / rect.width - 0.5;
        mouse.y = (event.clientY - rect.top) / rect.height - 0.5;
      };

      resize();
      window.addEventListener("resize", resize);
      window.addEventListener("pointermove", pointer, { passive: true });

      const animate = () => {
        points.rotation.y += 0.0009 + mouse.x * 0.0008;
        points.rotation.x += 0.00045 - mouse.y * 0.00045;
        renderer.render(scene, camera);
        frame = window.requestAnimationFrame(animate);
      };
      animate();

      cleanup = () => {
        window.cancelAnimationFrame(frame);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", pointer);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    init();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [prefersReducedMotion]);

  return <div ref={mountRef} className="pointer-events-none absolute inset-0 z-0 opacity-70" aria-hidden="true" />;
}
