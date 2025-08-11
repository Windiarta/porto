"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[70vh] grid md:grid-cols-2 items-center gap-10">
      <div className="space-y-5">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight"
        >
          Full Stack Developer & AI Engineer
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-gray-600 text-lg md:text-xl max-w-xl"
        >
          I build end-to-end products: from delightful interfaces to scalable APIs and state-of-the-art AI systems—LLMs, RAG, and MLOps.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex gap-3"
        >
          <a href="#portfolio" className="px-5 py-3 rounded-xl bg-black text-white transition-transform duration-200 hover:scale-105 active:scale-95">View Work</a>
          <a href="#contact" className="px-5 py-3 rounded-xl border border-black transition-transform duration-200 hover:scale-105 active:scale-95">Get in Touch</a>
        </motion.div>
      </div>
      <div className="relative h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden border border-gray-200">
        <Image
          src="/assets/hero-visual.jpg"
          alt="Hero Visual"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}


