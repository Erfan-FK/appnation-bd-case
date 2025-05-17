import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyJwt } from '../utils/jwt';
import jwt from 'jsonwebtoken';
const { TokenExpiredError } = jwt;

export interface AuthRequest extends Request {
  user?: { id: string; role: Role };
}

// Authenticate via JWT.  Pass `true` to allow unauthenticated access (public route).
export function authenticate(allowPublic = false) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const hdr = req.headers.authorization;

    if (!hdr?.startsWith('Bearer ')) {
      if (allowPublic) return next();
      return res.status(401).json({ error: 'Missing token' });
    }

    try {
        const token = hdr.slice(7);
        req.user = verifyJwt<{ id: string; role: Role }>(token);
        next();
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// Restrict route to one or more roles
export function authorize(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}