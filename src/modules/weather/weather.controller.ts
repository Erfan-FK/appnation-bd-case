import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize, AuthRequest } from '../../middleware/auth.middleware';
import { weatherQuerySchema } from './weather.dto';
import { validate } from '../../middleware/validate.middleware';
import * as service from './weather.service';
import { Role } from '@prisma/client';
import logger from '../../utils/logger';

const router = Router();

/**
 * GET /weather?city=London
 * • USER  & ADMIN allowed
 * • Validates `city` query param with Zod
 */
router.get(
  '/',
  authenticate(),                       // ← call the HOF
  authorize(Role.USER, Role.ADMIN),     // ← enum + variadic form
  validate(weatherQuerySchema, 'query'),// ← validate query not body
  async (req: Request & AuthRequest, res: Response, next: NextFunction) => {
    try {
      const city = (req.query.city as string).trim();
      const data = await service.getWeather(city, req.user!.id);
      res.json(data);
    } catch (error) {
      // Pass the error to the error middleware
      next(error);
    }
  },
);

export default router;
