"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Category = { _id: string; title: string };
type Skill = { _id: string; name: string; level?: string; categories?: Array<{ _ref: string }> };
type Tool = { _id: string; name: string; description?: string; categories?: Array<{ _ref: string }> };

export default function SkillsToolsTabs({
    skills,
    tools,
    categories,
}: {
    skills: Skill[];
    tools: Tool[];
    categories: Category[];
}) {
    const [tab, setTab] = useState<"skills" | "tools">("skills");
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const sortedCategories = useMemo(() => {
        const others = categories.filter((c) => c.title.trim().toLowerCase() === "others");
        const rest = categories
            .filter((c) => c.title.trim().toLowerCase() !== "others")
            .sort((a, b) => a.title.localeCompare(b.title));
        return [...rest, ...others];
    }, [categories]);

    const filteredSkills = useMemo(() => {
        if (!activeCategory) return skills;
        return skills.filter((s) => s.categories?.some((c) => c._ref === activeCategory));
    }, [skills, activeCategory]);

    const filteredTools = useMemo(() => {
        if (!activeCategory) return tools;
        return tools.filter((t) => t.categories?.some((c) => c._ref === activeCategory));
    }, [tools, activeCategory]);

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
                    <button
                        onClick={() => { setTab("skills"); setActiveCategory(null); }}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "skills" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-foreground/50 hover:text-foreground"
                            }`}
                    >
                        Skills
                    </button>
                    <button
                        onClick={() => { setTab("tools"); setActiveCategory(null); }}
                        className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all ${tab === "tools" ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-foreground/50 hover:text-foreground"
                            }`}
                    >
                        Tools
                    </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setActiveCategory(null)}
                        className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${!activeCategory ? "bg-foreground text-background border-transparent" : "glass border-white/5 hover:bg-white/10"
                            }`}
                    >
                        All
                    </button>
                    {sortedCategories.map((c) => (
                        <button
                            key={c._id}
                            onClick={() => setActiveCategory(c._id)}
                            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${activeCategory === c._id ? "bg-foreground text-background border-transparent" : "glass border-white/5 hover:bg-white/10"
                                }`}
                        >
                            {c.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
                    >
                        {tab === "skills" ? (
                            filteredSkills.map((s, i) => (
                                <motion.div
                                    key={s._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className={`p-6 rounded-3xl glass border border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden ${i % 7 === 0 ? "md:col-span-2 md:row-span-2" : ""
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 space-y-2">
                                        <h3 className="font-bold text-lg tracking-tight group-hover:text-accent transition-colors">{s.name}</h3>
                                        {s.level && <p className="text-xs text-foreground/40 font-medium uppercase tracking-widest">{s.level}</p>}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            filteredTools.map((t, i) => (
                                <motion.div
                                    key={t._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className={`p-6 rounded-3xl glass border border-white/5 hover:border-accent/30 transition-all group relative overflow-hidden ${i % 5 === 0 ? "md:col-span-2 lg:col-span-2" : ""
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-accent-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 space-y-2">
                                        <h3 className="font-bold text-lg tracking-tight group-hover:text-accent-secondary transition-colors">{t.name}</h3>
                                        {t.description && <p className="text-sm text-foreground/60 leading-relaxed line-clamp-2">{t.description}</p>}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
