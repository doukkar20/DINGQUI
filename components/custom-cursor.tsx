"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

type CursorMode = "default" | "hover" | "product" | "cta";

export function CustomCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const ringX = useSpring(mouseX, { stiffness: 190, damping: 26, mass: 0.45 });
  const ringY = useSpring(mouseY, { stiffness: 190, damping: 26, mass: 0.45 });
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    const updateEnabled = () => setEnabled(finePointer.matches);
    updateEnabled();
    finePointer.addEventListener("change", updateEnabled);

    const handleMove = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const handleOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      if (target.closest("[data-cursor-product]")) {
        setMode("product");
        return;
      }

      if (target.closest("[data-cursor='cta']")) {
        setMode("cta");
        return;
      }

      if (target.closest("a,button,select,input,textarea,[role='button']")) {
        setMode("hover");
        return;
      }

      setMode("default");
    };

    const handleOut = (event: MouseEvent) => {
      const related = event.relatedTarget as HTMLElement | null;
      if (!related || related === document.documentElement) {
        setMode("default");
      }
    };

    window.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);

    return () => {
      finePointer.removeEventListener("change", updateEnabled);
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
    };
  }, [mouseX, mouseY]);

  if (!enabled) {
    return null;
  }

  const size = mode === "product" ? 74 : mode === "cta" ? 68 : mode === "hover" ? 54 : 38;

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="premium-cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: size,
          height: size,
          borderColor: mode === "default" ? "rgba(249,115,22,0.42)" : "rgba(255,122,26,0.95)",
          backgroundColor: mode === "cta" ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.02)",
        }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        {mode === "product" && <span>شوف</span>}
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="premium-cursor-dot"
        style={{ x: mouseX, y: mouseY }}
        animate={{ scale: mode === "default" ? 1 : 1.7 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
      />
    </>
  );
}
