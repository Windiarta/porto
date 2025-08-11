"use client";
import { useMemo, useState } from "react";

type Category = { _id: string; title: string; slug?: { current?: string } };
type Project = {
  _id: string;
  title: string;
  description: string;
  url?: string;
  coverUrl?: string;
  categories?: Array<{ _ref: string }>;
};

export default function PortfolioFilters({
  categories,
  projects,
}: {
  categories: Category[];
  projects: Project[];
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
    if (!active) return projects;
    return projects.filter((p) => p.categories?.some((c) => c._ref === active));
  }, [projects, active]);

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
        {filtered.map((p) => (
          <article key={p._id} className="group border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
            {p.coverUrl && (
              <div className="aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.coverUrl} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{p.description}</p>
              {p.url && (
                <a href={p.url} className="text-sm text-black underline" target="_blank" rel="noreferrer">
                  Visit →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}


