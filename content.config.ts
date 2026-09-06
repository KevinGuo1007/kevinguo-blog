import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const blogSchema = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  translationKey: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  date: z.string().date(),
  updated: z.string().date().optional(),
  image: z.string().optional(),
  tags: z
    .array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))
    .default([]),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export default defineContentConfig({
  collections: {
    blogEn: defineCollection({
      type: "page",
      source: "en-US/blog/**/*.md",
      schema: blogSchema,
    }),

    blogZh: defineCollection({
      type: "page",
      source: "zh-CN/blog/**/*.md",
      schema: blogSchema,
    }),
  },
});
