module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Weather Backend API',
    version: '1.0.0',
    description: 'OpenWeather demo backend for Backend Engineer Intern Case Study',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};
