import { useRef } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion.js";

export default function MagneticButton({ as: Component = "a", className = "", children, onNavigate, ...props }) {
  const ref = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handlePointerMove = (event) => {
    if (prefersReducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.18;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.18;
    element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate3d(0, 0, 0)";
  };

  return (
    <Component
      ref={ref}
      className={`magnetic-button ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      onClick={onNavigate}
      {...props}
    >
      {children}
    </Component>
  );
}
