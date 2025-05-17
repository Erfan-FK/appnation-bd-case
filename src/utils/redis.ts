import * as ioredisModule from 'ioredis';
import { config } from '../config/index';
import logger from './logger';

const Redis = ioredisModule.default || ioredisModule;
const redis = new Redis(config.redisUrl);

redis.on('error', (err: Error) => logger.error({ err }, 'Redis connection error'));

export default redis;
