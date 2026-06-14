"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.35,
  });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-gradient-to-r from-deep-orange via-neon-orange to-soft-orange shadow-[0_0_18px_rgba(249,115,22,0.8)]"
      style={{ scaleX }}
    />
  );
}
