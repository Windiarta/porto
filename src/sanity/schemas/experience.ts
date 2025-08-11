import { defineField, defineType } from "sanity";

export default defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({ name: "role", type: "string", title: "Role" }),
    defineField({ name: "company", type: "string", title: "Company" }),
    defineField({ name: "startDate", type: "date", title: "Start Date" }),
    defineField({ name: "endDate", type: "date", title: "End Date" }),
    defineField({ name: "current", type: "boolean", title: "Currently Working" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }] }),
    defineField({
      name: "categories",
      type: "array",
      title: "Categories",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
  ],
  preview: {
    select: { title: "role", subtitle: "company" },
  },
});


