import z from "zod";
import { CATEGORY_TYPE } from "../../../enums/category";

const createCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    image: z.any({required_error:"Image is required"}),
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.any().optional(),
    type: z.nativeEnum(CATEGORY_TYPE).optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};