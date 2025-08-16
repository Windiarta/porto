"use client";
import { useMemo, useState } from "react";

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

// Helper function to render formatted text
function renderText(children: Array<{ text?: string; marks?: string[] }>) {
  return children.map((child, index) => {
    if (!child.text) return null;
    
    const text = child.text;
    let className = "";
    
    // Apply formatting based on marks
    if (child.marks?.includes('strong')) {
      className += " font-semibold";
    }
    if (child.marks?.includes('em')) {
      className += " italic";
    }
    if (child.marks?.includes('underline')) {
      className += " underline";
    }
    if (child.marks?.includes('code')) {
      className += " bg-gray-100 px-1 rounded font-mono text-sm";
    }
    
    return (
      <span key={index} className={className.trim()}>
        {text}
      </span>
    );
  });
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
      <div className="space-y-4">
        {filtered.map((e) => (
          <div key={e._id} className="p-4 border rounded-2xl">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{e.role}</h3>
              <span className="text-sm text-gray-500">
                {formatDate(e.startDate)} - {e.current ? "Present" : e.endDate ? formatDate(e.endDate) : ""}
              </span>
            </div>
            <div className="text-gray-600 text-sm">{e.company}</div>
            {e.description && e.description.length > 0 && (
              <ul className="mt-3 list-disc list-inside text-sm text-gray-700 space-y-1">
                {e.description.map((block, i) => {
                  if (!block?.children || block.children.length === 0) return null;
                  
                  return (
                    <li key={i}>
                      {renderText(block.children)}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(d: string) {
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}


