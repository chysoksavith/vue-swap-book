import slugify from "slugify";

export const generateSlug = (text: string): string => {
  return slugify(text.toLowerCase(), {
    lower: true,
    strict: true,
    trim: true,
  });
};
