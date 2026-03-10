"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Parallax from "@/components/Parallax";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] grid md:grid-cols-2 items-center gap-12 py-20">
      <div className="space-y-8 text-left max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          Available for new projects
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95]"
        >
          CRAFTING <span className="bg-gradient-to-r from-accent via-violet-400 to-accent-secondary bg-clip-text text-transparent italic">INTELLIGENT</span> DIGITAL EXPERIENCES.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-foreground/60 text-lg md:text-xl leading-relaxed"
        >
          Full Stack Developer & AI Engineer specializing in LLMs, RAG, and high-performance web applications.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 pt-4"
        >
          <a href="#portfolio" className="px-8 py-4 rounded-full bg-foreground text-background font-bold hover:scale-105 active:scale-95 transition-all duration-200 text-center">
            View Work
          </a>
          <a href="https://drive.google.com/drive/folders/1LlXf7-UQOnaj7gQ4FFGOP_apulw788cd?usp=sharing" target="_blank" className="px-8 py-4 rounded-full glass font-bold hover:bg-white/10 transition-all duration-200 text-center">
            Download CV
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 50, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="relative w-full aspect-square md:aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 group shadow-2xl shadow-accent/5 bg-white/5 z-10"
      >
        <Parallax offset={20} className="w-full h-full">
          <Image
            src="/assets/hero-visual.jpg"
            alt="Hero Visual"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
            unoptimized
          />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent pointer-events-none z-20" />
      </motion.div>
    </section>
  );
}
