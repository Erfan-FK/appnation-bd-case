import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { Role } from '@prisma/client';
import prisma from '../../prisma/client';
import { signupSchema } from '../auth/auth.dto';
import { validate } from '../../middleware/validate.middleware';
import * as authService from '../auth/auth.service';

const router = Router();

// All endpoints below this line require an ADMIN token
router.use(authenticate(), authorize(Role.ADMIN));

router.post('/', validate(signupSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = await authService.signup(email, password, role);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;
