import { z } from 'zod';

export const weatherQuerySchema = z.object({
  city: z.string().min(1),
});
