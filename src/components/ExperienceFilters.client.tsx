"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

type Category = { _id: string; title: string };
type Experience = {
  _id: string;
  role: string;
  company: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  categories?: Array<{ _ref: string }>;
  description?: Array<{
    children?: Array<{
      text?: string;
      marks?: string[];
    }>;
    style?: string;
  }>;
};

function renderText(children: Array<{ text?: string; marks?: string[] }>) {
  return children.map((child, index) => {
    if (!child.text) return null;
    let className = "";
    if (child.marks?.includes('strong')) className += " font-black text-foreground";
    if (child.marks?.includes('em')) className += " italic";
    if (child.marks?.includes('code')) className += " bg-white/10 px-2 py-0.5 rounded-md font-mono text-xs text-accent";

    return <span key={index} className={className.trim()}>{child.text}</span>;
  });
}

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceFilters({
  categories,
  experiences,
}: {
  categories: Category[];
  experiences: Experience[];
}) {
  const [active, setActive] = useState<string | null>(null);

  const sortedCategories = useMemo(() => {
    const others = categories.filter((c) => c.title.trim().toLowerCase() === "others");
    const rest = categories
      .filter((c) => c.title.trim().toLowerCase() !== "others")
      .sort((a, b) => a.title.localeCompare(b.title));
    return [...rest, ...others];
  }, [categories]);

  const filtered = useMemo(() => {
    if (!active) return experiences;
    return experiences.filter((e) => e.categories?.some((c) => c._ref === active));
  }, [experiences, active]);

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => setActive(null)}
          className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${!active ? "bg-accent text-white" : "glass text-foreground/50"}`}
        >
          Full Journey
        </button>
        {sortedCategories.map((c) => (
          <button
            key={c._id}
            onClick={() => setActive(c._id)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${active === c._id ? "bg-accent text-white" : "glass text-foreground/50"}`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="relative space-y-12">
        {/* Central Timeline Line */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent-secondary/50 to-transparent md:-translate-x-1/2" />

        {filtered.map((e, idx) => (
          <motion.div
            key={e._id}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`relative flex flex-col md:flex-row items-center gap-8 ${idx % 2 === 0 ? "md:flex-row-reverse" : ""}`}
          >
            {/* Dot */}
            <div className="absolute left-0 md:left-1/2 w-4 h-4 rounded-full bg-accent border-4 border-background md:-translate-x-1/2 z-10" />

            <div className="w-full md:w-1/2 ps-8 md:ps-0">
              <div className={`glass glass-hover p-8 rounded-[2rem] space-y-4 group transition-all duration-500 ${idx % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                <div className="space-y-1">
                  <span className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                    {formatDate(e.startDate)} — {e.current ? "Present" : e.endDate ? formatDate(e.endDate) : ""}
                  </span>
                  <h3 className="text-2xl font-black tracking-tight group-hover:text-accent duration-500 transition-colors uppercase italic">{e.role}</h3>
                  <div className="text-foreground/50 font-bold tracking-tight">{e.company}</div>
                </div>

                {e.description && e.description.length > 0 && (
                  <ul className={`space-y-3 text-sm text-foreground/60 leading-relaxed ${idx % 2 === 0 ? "md:list-none" : "list-none"}`}>
                    {e.description.map((block, i) => (
                      <li key={i} className="flex gap-3 group-hover:text-foreground/80 duration-500 transition-colors">
                        <span className={`text-accent font-black ${idx % 2 === 0 ? "order-last" : "order-first"}`}>•</span>
                        <span>{renderText(block?.children || [])}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}



