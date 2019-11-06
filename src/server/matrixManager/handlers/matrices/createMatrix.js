const asyncMiddleware = require("../../../handlers/asyncMiddleware");
import models from "../../models";

const createMatrix = asyncMiddleware(async (request, response, next) => {
  const matrixDetails = await models.sequelize.transaction(
    async transaction => {
      let values = request.body;
      const matrixCreated = await models.matrices.create(values, {
        auditUser: request.nickname,
        transaction
      });
      return matrixCreated;
    }
  );
  response.status(201).send(matrixDetails);
});

module.exports = createMatrix;
