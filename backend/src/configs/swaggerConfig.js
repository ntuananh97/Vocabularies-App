const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for my ecomerce app',
    },
  },
  apis: ['../routes/index.js'], // Đường dẫn tới các file định nghĩa API của bạn
};

const swaggerSpec = swaggerJsDoc(options);

const integrateSwagger = (app) => {
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = integrateSwagger;
