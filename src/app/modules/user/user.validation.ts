import { z } from 'zod';
import { USER_ROLES } from '../../../enums/user';

const createUserZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).optional(),
    // contact: z.string({ required_error: 'Contact is required' }).optional(),
    email: z.string({ required_error: 'Email is required' }).optional(),
    password: z.string({ required_error: 'Password is required' }).optional(),
    // location: z.string({ required_error: 'Location is required' }),
    // profile: z.string().optional(),
    role : z.nativeEnum(USER_ROLES),
  }),
});

const updateUserZodSchema = z.object({
  name: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().optional(),
  password: z.string().optional(),
  location: z.string().optional(),
  image: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
