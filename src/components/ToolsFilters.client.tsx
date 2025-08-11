"use client";
import { useMemo, useState } from "react";

type Category = { _id: string; title: string };
type Tool = { _id: string; name: string; description?: string; categories?: Array<{ _ref: string }> };

export default function ToolsFilters({
  tools,
  categories,
}: {
  tools: Tool[];
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
    if (!active) return tools;
    return tools.filter((t) => t.categories?.some((c) => c._ref === active));
  }, [tools, active]);

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
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((t) => (
          <article key={t._id} className="p-4 border rounded-2xl">
            <h3 className="font-semibold">{t.name}</h3>
            {t.description && <p className="text-sm text-gray-600 mt-1">{t.description}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}


