import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT ? Number(process.env.PORT) : 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  databaseUrl: process.env.DATABASE_URL!,
  redisUrl: process.env.REDIS_URL!,

  apiKey: process.env.API_KEY!,
  jwtSecret: process.env.JWT_SECRET!,
};
