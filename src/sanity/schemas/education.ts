import { defineField, defineType } from "sanity";

export default defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    defineField({ name: "degree", type: "string", title: "Degree" }),
    defineField({ name: "school", type: "string", title: "School" }),
    defineField({ name: "startDate", type: "date", title: "Start Date" }),
    defineField({ name: "endDate", type: "date", title: "End Date" }),
    defineField({ name: "current", type: "boolean", title: "Currently Enrolled" }),
    defineField({ name: "description", type: "array", of: [{ type: "block" }], title: "Description" }),
  ],
  preview: {
    select: { title: "degree", subtitle: "school" },
  },
});


