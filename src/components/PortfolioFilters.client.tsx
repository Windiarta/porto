"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Category = { _id: string; title: string; slug?: { current?: string } };
type Project = {
  _id: string;
  title: string;
  description: string;
  url?: string;
  coverUrl?: string;
  categories?: Array<{ _ref: string }>;
  tech?: string[];
  slug?: { current?: string };
};

export default function PortfolioFilters({
  categories,
  projects,
}: {
  categories: Category[];
  projects: Project[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);

  const sortedCategories = useMemo(() => {
    const others = categories.filter((c) => c.title.trim().toLowerCase() === "others");
    const rest = categories
      .filter((c) => c.title.trim().toLowerCase() !== "others")
      .sort((a, b) => a.title.localeCompare(b.title));
    return [...rest, ...others];
  }, [categories]);

  const filtered = useMemo(() => {
    if (!active) return projects;
    return projects.filter((p) => p.categories?.some((c) => c._ref === active));
  }, [projects, active]);

  return (
    <div className="space-y-12">
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => setActive(null)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!active ? "bg-accent text-white shadow-lg shadow-accent/20" : "glass text-foreground/50 hover:text-foreground hover:bg-white/10"}`}
        >
          All Masterpieces
        </button>
        {sortedCategories.map((c) => (
          <button
            key={c._id}
            onClick={() => setActive(c._id)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${active === c._id ? "bg-accent text-white shadow-lg shadow-accent/20" : "glass text-foreground/50 hover:text-foreground hover:bg-white/10"}`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((p, idx) => (
            <motion.article
              layout
              key={p._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group glass glass-hover rounded-[2.5rem] overflow-hidden cursor-pointer flex flex-col h-full"
              onClick={() => {
                if (p.slug?.current) {
                  window.location.href = `/projects/${p.slug.current}`;
                } else {
                  setSelected(p);
                }
              }}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {p.coverUrl ? (
                  <img src={p.coverUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center text-foreground/20 italic">No Preview</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <span className="text-white text-xs font-black tracking-widest uppercase bg-accent px-3 py-1 rounded-full">View Details</span>
                </div>
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col">
                <h3 className="text-2xl font-black tracking-tight group-hover:text-accent transition-colors">{p.title}</h3>
                <p className="text-foreground/50 text-sm line-clamp-2 leading-relaxed flex-1">{p.description}</p>
                {p.tech && p.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {p.tech.slice(0, 3).map((t, i) => (
                      <span key={i} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-white/5 border border-white/10 text-foreground/60">{t}</span>
                    ))}
                    {p.tech.length > 3 && (
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full bg-white/5 border border-white/10 text-foreground/40">+{p.tech.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 md:p-10"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative glass rounded-[3rem] shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-6 right-6 w-12 h-12 rounded-full glass flex items-center justify-center text-3xl font-light text-foreground/50 hover:text-foreground z-20 transition-all"
                onClick={() => setSelected(null)}
              >
                ×
              </button>

              <div className="md:w-3/5 w-full bg-black/50 overflow-hidden">
                {selected.coverUrl ? (
                  <img src={selected.coverUrl} alt={selected.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/10 italic text-4xl font-black">PREVIEW N/A</div>
                )}
              </div>

              <div className="flex-1 p-8 md:p-12 flex flex-col gap-8 overflow-y-auto">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-black tracking-tighter">{selected.title}</h2>
                  <div className="flex flex-wrap gap-2 text-accent font-bold uppercase tracking-widest text-[10px]">
                    {selected.tech?.map((t, i) => <span key={i}>#{t}</span>)}
                  </div>
                </div>

                <p className="text-foreground/70 text-lg leading-relaxed whitespace-pre-line">{selected.description}</p>

                <div className="mt-auto pt-8">
                  {selected.url ? (
                    <a
                      href={selected.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-4 px-10 py-5 rounded-full bg-foreground text-background font-black hover:scale-105 transition-transform"
                    >
                      EXPLORE LIVE PROJECT
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                    </a>
                  ) : (
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                      <p className="text-foreground/40 font-black uppercase tracking-widest text-xs">This project is not publicly hosted yet.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



