import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", title: "Title" }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({ name: "cover", type: "image", title: "Cover", options: { hotspot: true } }),
    defineField({ name: "url", type: "url", title: "Project URL" }),
    defineField({
      name: "categories",
      type: "array",
      title: "Categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
    defineField({
      name: "tech",
      type: "array",
      title: "Tech Stack",
      of: [{ type: "string" }],
    }),
    defineField({ name: "featured", type: "boolean", title: "Featured" }),
  ],
  preview: {
    select: { title: "title", media: "cover" },
  },
});


