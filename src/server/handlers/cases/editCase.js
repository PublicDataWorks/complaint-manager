import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";

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

        await models.cases.update(valuesToUpdate, {
          where: { id: request.params.id },
          individualHooks: true,
          transaction,
          auditUser: request.nickname
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
