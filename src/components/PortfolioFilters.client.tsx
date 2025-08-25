"use client";
import { useMemo, useState } from "react";

// Add for dialog/modal
import { Fragment } from "react";

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
  // Dialog state
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
          <article
            key={p._id}
            className="group border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            onClick={() => {
              if (p.slug?.current) {
                window.location.href = `/projects/${p.slug.current}`;
              } else {
                setSelected(p);
              }
            }}
          >
            {p.coverUrl && (
              <div className="aspect-[4/3] bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.coverUrl} alt={p.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{p.description}</p>
              {p.tech && p.tech.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.tech.slice(0, 4).map((t, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">{t}</span>
                  ))}
                  {p.tech.length > 4 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 border">+{p.tech.length - 4}</span>
                  )}
                </div>
              )}
              {p.url && (
                <a href={p.url} className="text-sm text-black underline" target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                  Visit →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* Dialog/Modal for project preview */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setSelected(null)}>
          <div
            className="relative bg-[#18181b] text-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 flex flex-col md:flex-row overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Image section */}
            {selected.coverUrl && (
              <div className="md:w-1/2 w-full flex items-center justify-center bg-black">
                <img
                  src={selected.coverUrl}
                  alt={selected.title}
                  className="object-contain max-h-[60vh] w-full h-full"
                />
              </div>
            )}
            {/* Details section */}
            <div className="flex-1 p-8 flex flex-col gap-4 min-w-[300px]">
              <button
                className="absolute top-4 right-4 text-2xl text-white/70 hover:text-white"
                onClick={() => setSelected(null)}
                aria-label="Close preview"
              >
                ×
              </button>
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{selected.title}</h2>
              <p className="text-gray-200 text-base mb-4 whitespace-pre-line">{selected.description}</p>
              {/* Tech stack */}
              {selected.tech && selected.tech.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map((t, i) => (
                    <span key={i} className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/20">{t}</span>
                  ))}
                </div>
              )}
              <div className="mt-auto flex flex-col gap-2">
                <button
                  className={`px-6 py-3 rounded-xl font-semibold text-lg transition-colors ${selected.url ? "bg-white text-black hover:bg-gray-200" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}
                  disabled={!selected.url}
                  onClick={() => {
                    if (selected.url) window.open(selected.url, "_blank");
                  }}
                >
                  Visit Link
                </button>
                {!selected.url && (
                  <span className="text-sm text-red-300">URL is restricted or not available.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


