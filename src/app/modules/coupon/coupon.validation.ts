import z from "zod";

const createCouponZodSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: "name is required",
        }),
        discount: z.string({
            required_error: "Discount is required",
        }),
        expiry: z.string({
            required_error: "Expiry is required",
        }),
    }),
});

export const CouponValidation = {
    createCouponZodSchema,
};