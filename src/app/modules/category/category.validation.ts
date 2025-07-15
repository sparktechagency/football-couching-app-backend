import z from "zod";
import { CATEGORY_TYPE } from "../../../enums/category";

const createCategoryZodSchema = z.object({
  body: z.object({
    title: z.string({
      required_error: "Title is required",
    }),
    image: z.any({required_error:"Image is required"}),
    type: z.nativeEnum(CATEGORY_TYPE, {
      required_error: "Type is required",
    })
  }),
});

const updateCategoryZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    image: z.instanceof(File).optional(),
    type: z.nativeEnum(CATEGORY_TYPE).optional(),
  }),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};