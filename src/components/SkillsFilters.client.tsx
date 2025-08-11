"use client";
import { useMemo, useState } from "react";

type Category = { _id: string; title: string };
type Skill = { _id: string; name: string; level?: string; categories?: Array<{ _ref: string }> };

export default function SkillsFilters({
  skills,
  categories,
}: {
  skills: Skill[];
  categories: Category[];
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
    if (!active) return skills;
    return skills.filter((s) => s.categories?.some((c) => c._ref === active));
  }, [skills, active]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setActive(null)}
          className={`px-3 py-1.5 rounded-full border ${!active ? "bg-black text-white" : "hover:bg-gray-50"}`}
        >
          All
        </button>
        {sortedCategories.map((c) => (
          <button
            key={c._id}
            onClick={() => setActive(c._id)}
            className={`px-3 py-1.5 rounded-full border ${active === c._id ? "bg-black text-white" : "hover:bg-gray-50"}`}
          >
            {c.title}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {filtered.map((s) => (
          <span key={s._id} className="px-3 py-1.5 rounded-full border bg-white hover:bg-gray-50">
            {s.name}
            {s.level ? ` · ${s.level}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}


