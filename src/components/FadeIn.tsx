"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: FadeInProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const prefersReducedMotion = useReducedMotion();

  const getOffset = () => {
    if (prefersReducedMotion) return { x: 0, y: 0 };
    switch (direction) {
      case "up": return { y: 40 };
      case "down": return { y: -40 };
      case "left": return { x: 40 };
      case "right": return { x: -40 };
      default: return { y: 40 };
    }
  };

  const offset = getOffset();

  return (
    <div ref={ref} className={className}>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, ...offset }}
        animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.6, delay, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
