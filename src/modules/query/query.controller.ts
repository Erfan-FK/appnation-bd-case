import { Router, NextFunction, Response } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.middleware';
import prisma from '../../prisma/client';
import { Role } from '@prisma/client';

const router = Router();

/**
 * GET /queries
 * - ADMIN  → every user's queries (includes user {id,email})
 * - USER   → only queries belonging to req.user.id
 */
router.get('/', authenticate(), async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user?.role === Role.ADMIN;

    const queries = await prisma.weatherQuery.findMany({
      where: isAdmin ? undefined : { userId: req.user!.id },
      include: isAdmin
        ? { user: { select: { id: true, email: true } } }
        : undefined,
      orderBy: { requestedAt: 'desc' },
    });

    res.json(queries);
  } catch (error) {
    next(error);
  }
});

export default router;
