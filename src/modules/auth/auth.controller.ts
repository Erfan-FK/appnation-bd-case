import * as service from './auth.service';
import { signupSchema, loginSchema } from './auth.dto';
import { validate } from '../../middleware/validate.middleware';

import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

const router = Router();

router.post('/signup', validate(signupSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, role } = req.body;
    const user = await service.signup(email, password, role);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { token } = await service.login(email, password);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;
