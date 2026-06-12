import { useEffect } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion.js";

export function useGsapScrollReveal(scopeRef) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope || prefersReducedMotion) return undefined;

    let context;
    let cancelled = false;

    async function run() {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        gsap.utils.toArray(".motion-reveal").forEach((element) => {
          gsap.fromTo(
            element,
            { autoAlpha: 0, y: 28, scale: 0.985 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                once: true,
              },
            },
          );
        });

        gsap.utils.toArray(".motion-stagger").forEach((group) => {
          gsap.fromTo(
            group.children,
            { autoAlpha: 0, y: 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: {
                trigger: group,
                start: "top 84%",
                once: true,
              },
            },
          );
        });
      }, scope);
    }

    run();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [prefersReducedMotion, scopeRef]);
}
