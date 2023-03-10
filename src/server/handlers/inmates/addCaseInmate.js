import canBeAnonymous from "../officers/helpers/canBeAnonymous";
import { updateCaseToActiveIfInitial } from "../cases/helpers/caseStatusHelpers";
import models from "../../policeDataManager/models";
import asyncMiddleware from "../asyncMiddleware";
import Boom from "boom";
import {
  BAD_REQUEST_ERRORS,
  NOT_FOUND_ERRORS
} from "../../../sharedUtilities/errorMessageConstants";

const addCaseInmate = asyncMiddleware(async (request, response, next) => {
  const { inmateId, notes, roleOnCase } = request.body;
  const isAnonymous = canBeAnonymous(request.body.isAnonymous, roleOnCase);

  const retrievedCase = await models.cases.findByPk(request.params.caseId);
  if (!retrievedCase) {
    throw Boom.notFound(NOT_FOUND_ERRORS.RESOURCE_NOT_FOUND);
  }

  if (!isAnonymous && inmateId) {
    const retrievedInmate = await models.inmate.findByPk(inmateId);
    if (!retrievedInmate) {
      throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_PERSON_IN_CUSTODY);
    }
  }

  let caseInmateAttributes = {
    caseId: request.params.caseId,
    inmateId,
    notes,
    roleOnCase,
    isAnonymous
  };

  const caseInmate = await models.sequelize.transaction(async transaction => {
    const createdCaseInmate = await models.caseInmate.create(
      caseInmateAttributes,
      {
        transaction,
        auditUser: request.nickname
      }
    );

    await updateCaseToActiveIfInitial(
      retrievedCase.id,
      request.nickname,
      transaction
    );

    return createdCaseInmate;
  });

  response.status(200).send(await caseInmate.toJSON());

  // await sendNotifsIfComplainantChange(updatedCase.id);
});

module.exports = addCaseInmate;
