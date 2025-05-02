const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'MySarpas API',
        version: '1.0.0',
        description: 'API Documentation for MySarpas application',
    },
    security: [{
        bearerAuth: []
      }]
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;