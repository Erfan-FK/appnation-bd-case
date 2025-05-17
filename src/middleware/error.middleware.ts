import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) {
  const status = err.status ?? 500;
  logger.error({ err }, 'Unhandled error');

  res.status(status).json({
    error: err.message || 'Internal Server Error',
    ...(req.app.get('env') === 'development' && { stack: err.stack }),
  });
}
