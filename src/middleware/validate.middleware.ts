import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

type Location = 'body' | 'query' | 'params';

export function validate<T extends ZodTypeAny>(schema: T, location: Location = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = (req as any)[location];
    const result = schema.safeParse(data);

    if (!result.success) {
      return res.status(422).json({ error: result.error.errors });
    }

    (req as any)[location] = result.data; 
    next();
  };
}
