"use client";
import { motion } from "framer-motion";

type EducationItem = {
    _id: string;
    degree: string;
    school: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: Array<{ children?: Array<{ text?: string }> }>;
};

function formatDate(d: string) {
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function EducationCards({ items }: { items: EducationItem[] }) {
    return (
        <div className="grid md:grid-cols-2 gap-6">
            {items.map((e, idx) => (
                <motion.div
                    key={e._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative"
                >
                    <div className="absolute inset-y-0 left-0 w-1 bg-accent rounded-full scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />
                    <div className="glass glass-hover p-8 rounded-[2rem] space-y-4 h-full flex flex-col">
                        <div className="flex flex-col gap-1">
                            <span className="text-accent text-[10px] font-black uppercase tracking-[0.2em]">
                                {formatDate(e.startDate)} — {e.current ? "Present" : e.endDate ? formatDate(e.endDate) : ""}
                            </span>
                            <h3 className="text-2xl font-black tracking-tight group-hover:text-accent duration-500 transition-colors uppercase italic leading-tight">
                                {e.degree}
                            </h3>
                            <div className="text-foreground/50 font-bold tracking-tight">{e.school}</div>
                        </div>

                        {e.description && e.description.length > 0 && (
                            <ul className="space-y-3 text-sm text-foreground/60 leading-relaxed list-none mt-auto">
                                {e.description.map((block, i) => {
                                    const text = block?.children?.map((c) => c.text).join("") || "";
                                    if (!text) return null;
                                    return (
                                        <li key={i} className="flex gap-3 group-hover:text-foreground/80 duration-500 transition-colors">
                                            <span className="text-accent font-black">•</span>
                                            <span>{text}</span>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
