import z from "zod";
import { PERFORMANCE_TOPIC } from "../../../enums/performance";

const createPerformanceZodSchema = z.object({
  body: z.object({
    session: z.string({
      required_error: 'Session is required',
    }),
    user : z.string({
      required_error: 'User is required',
    }),
    atandance: z.string({
      required_error: 'Atandance is required',
    }).optional(),
    performance: z.array(
      z.object({
        topic: z.nativeEnum(PERFORMANCE_TOPIC),
        score: z.number({
          required_error: 'Score is required',
        }),
      })
    ).optional()
  }),
});

export const PerformanceValidation = {
  createPerformanceZodSchema,
};