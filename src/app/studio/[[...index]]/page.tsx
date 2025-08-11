"use client";
import { Studio } from "sanity";
import config from "@/sanity.config";

export default function StudioPage() {
  return (
    <div className="min-h-screen h-screen">
      <Studio config={config} />
    </div>
  );
}


