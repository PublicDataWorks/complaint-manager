const swaggerJSDoc = require("swagger-jsdoc");

const definition = {
  openapi: "3.0.0",
  info: {
    title: "Complaint Manager API",
    version: "1.0.0",
    description: "Complaint Manager API description"
  }
};

const options = {
  failOnErrors: true,
  definition,
  apis: ["src/server/handlers/cases/caseNotes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
