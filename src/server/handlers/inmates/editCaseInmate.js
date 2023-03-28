import asyncMiddleware from "../asyncMiddleware";
import models from "../../policeDataManager/models";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";

const editCaseInmate = asyncMiddleware(async (request, response, next) => {
  const caseInmate = await models.caseInmate.findByPk(
    request.params.caseInmateId
  );

  if (!caseInmate || caseInmate.id + "" !== request.params.caseInmateId) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_PERSON_IN_CUSTODY);
  }

  await caseInmate.update(
    {
      isAnonymous: request.body.isAnonymous,
      notes: request.body.notes
    },
    {
      auditUser: request.nickname
    }
  );

  return response.status(200).send({});
});

module.exports = editCaseInmate;
