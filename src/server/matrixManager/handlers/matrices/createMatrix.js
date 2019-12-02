import {
  BAD_DATA_ERRORS,
  BAD_REQUEST_ERRORS
} from "../../../../sharedUtilities/errorMessageConstants";

const asyncMiddleware = require("../../../handlers/asyncMiddleware");
import models from "../../models";

const Boom = require("boom");

const createMatrix = asyncMiddleware(async (request, response, next) => {
  let matrixDetails = null;
  let values = request.body;
  await models.matrices
    .findOne({
      where: {
        pibControlNumber: values.pibControlNumber
      }
    })
    .then(async existingMatrix => {
      if (existingMatrix) {
        throw Boom.badRequest(
          BAD_REQUEST_ERRORS.PIB_CONTROL_NUMBER_ALREADY_EXISTS
        );
      } else {
        matrixDetails = await models.sequelize.transaction(
          async transaction => {
            const matrixCreated = await models.matrices.create(values, {
              auditUser: request.nickname,
              transaction
            });
            return matrixCreated;
          }
        );
      }
    });
  response.status(201).send(matrixDetails);
});

module.exports = createMatrix;
