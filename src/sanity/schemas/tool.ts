import { defineField, defineType } from "sanity";

export default defineType({
  name: "tool",
  title: "Tool",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", title: "Name" }),
    defineField({ name: "description", type: "text", title: "Description" }),
    defineField({
      name: "categories",
      type: "array",
      title: "Categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});


