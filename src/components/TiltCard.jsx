import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function TiltCard({ as: Component = "div", className = "", children, ...props }) {
  const ref = useRef(null);
  const glareRef = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (event) => {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateX = (0.5 - py) * 5;
    const rotateY = (px - 0.5) * 5;
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,0.22), transparent 38%)`;
    }
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <Component
      ref={ref}
      className={`tilt-card ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      {...props}
    >
      {children}
      <span ref={glareRef} aria-hidden="true" className="tilt-glare" />
    </Component>
  );
}
