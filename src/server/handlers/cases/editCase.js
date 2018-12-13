import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";

const moment = require("moment");
const models = require("../../models");
const asyncMiddleware = require("../asyncMiddleware");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");
const _ = require("lodash");
const auditDataAccess = require("../auditDataAccess");
const Boom = require("boom");

async function upsertAddress(caseId, incidentLocation, transaction, nickname) {
  if (!incidentLocation.id) {
    await models.address.create(
      {
        ...incidentLocation,
        addressableType: ADDRESSABLE_TYPE.CASES,
        addressableId: caseId
      },
      {
        transaction,
        auditUser: nickname
      }
    );
  } else {
    await models.address.update(incidentLocation, {
      where: { id: incidentLocation.id },
      transaction,
      auditUser: nickname
    });
  }
}

const editCase = asyncMiddleware(async (request, response, next) => {
  if (
    !request.body.firstContactDate ||
    !moment(request.body.firstContactDate).isValid()
  ) {
    throw Boom.badRequest("Valid first contact date is required");
  } else {
    const caseValidationToggle = checkFeatureToggleEnabled(
      request,
      "caseValidationFeature"
    );

    const updatedCase = await models.sequelize.transaction(
      async transaction => {
        const valuesToUpdate = _.omit(request.body, [
          "createdBy",
          "assignedTo"
        ]);

        if (request.body.incidentLocation) {
          await upsertAddress(
            request.params.id,
            request.body.incidentLocation,
            transaction,
            request.nickname
          );
        }

        const caseToUpdate = await models.cases.findById(request.params.id);
        await caseToUpdate.update(valuesToUpdate, {
          individualHooks: true,
          transaction,
          auditUser: request.nickname,
          validate: caseValidationToggle
        });

        await auditDataAccess(
          request.nickname,
          request.params.id,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction
        );

        return await getCaseWithAllAssociations(request.params.id, transaction);
      }
    );
    response.status(200).send(updatedCase);
  }
});

module.exports = editCase;
