import pino from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Configure logger based on environment
let loggerConfig: pino.LoggerOptions = {
  level: isDevelopment ? 'debug' : 'info',
};

// Only use pino-pretty transport in development if it's available
if (isDevelopment) {
  try {
    // Try to dynamically require pino-pretty
    require.resolve('pino-pretty');
    loggerConfig = {
      ...loggerConfig,
      transport: {
        target: 'pino-pretty',
        options: { colorize: true },
      },
    };
  } catch (error) {
    // pino-pretty is not available, fall back to default transport
    console.warn('pino-pretty is not available, using default logger format');
  }
}

const logger = pino(loggerConfig);

export default logger;
