import z from "zod";

const createPackageZodSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: 'Name is required',
    }),
    price: z.number({
      required_error: 'Price is required',
    }),
    features: z.array(z.string({ required_error: 'Features is required' })),
    duration:z.enum(["month","week","year"])
  }),
});
const updatePackageZodSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    price: z.number().optional(),
    features: z.array(z.string()).optional(),
  }),
});
export const PackageValidation = {
  createPackageZodSchema,
  updatePackageZodSchema,
};