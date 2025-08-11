import { defineField, defineType } from "sanity";

export default defineType({
  name: "skill",
  title: "Skill",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", title: "Name" }),
    defineField({
      name: "level",
      type: "string",
      title: "Level",
      options: { list: ["Beginner", "Intermediate", "Advanced", "Expert"] },
    }),
    defineField({
      name: "categories",
      type: "array",
      title: "Categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "level" },
  },
});


