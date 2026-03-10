"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ParallaxProps {
    children: ReactNode;
    offset?: number;
    className?: string;
}

export default function Parallax({
    children,
    offset = 50,
    className = "",
}: ParallaxProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const prefersReducedMotion = useReducedMotion();

    // If reduced motion is preferred, don't apply the transform
    const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div
                className="relative w-full h-full"
                style={prefersReducedMotion ? {} : { y }}
            >
                {children}
            </motion.div>
        </div>
    );
}
