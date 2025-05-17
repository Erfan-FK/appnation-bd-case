import jwt from 'jsonwebtoken';
import { config } from '../config/index';

export function signJwt(payload: object, expiresIn = '1d') {
  return jwt.sign(payload, config.jwtSecret as jwt.Secret, { expiresIn } as jwt.SignOptions);
}

export function verifyJwt<T>(token: string): T {
  return jwt.verify(token, config.jwtSecret) as T;
}
