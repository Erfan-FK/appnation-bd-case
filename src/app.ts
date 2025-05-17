import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { errorHandler } from './middleware/error.middleware';
import logger from './utils/logger';
import { config } from './config/index';

import authRouter from './modules/auth/auth.controller';
import userRouter from './modules/user/user.controller';
import weatherRouter from './modules/weather/weather.controller';
import queryRouter from './modules/query/query.controller';

const app = express();

app.use(express.json());
app.use(morgan('dev', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/auth', authRouter);
app.use('/weather', weatherRouter);
app.use('/queries', queryRouter);
app.use('/admin/users', userRouter);

// Swagger docs
const openapiPath = config.nodeEnv === 'production' ? 'dist/docs/openapi.yaml' : 'src/docs/openapi.yaml';
const swaggerDocument = YAML.load(openapiPath);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handler
app.use(errorHandler);

export default app;
