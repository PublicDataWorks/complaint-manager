const moment = require("moment");
const models = require("../../models");
const asyncMiddleware = require("../asyncMiddleware");
const getCaseWithAllAssociations = require("../getCaseWithAllAssociations");
const _ = require("lodash");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../sharedUtilities/constants");

async function upsertAddress(caseId, incidentLocation, transaction, nickname) {
  if (!incidentLocation.id) {
    const createdAddress = await models.address.create(
      {
        ...incidentLocation,
        addressableType: "cases",
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
    response.status(400).json({ error: "firstContactDate is required" });
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

        await models.action_audit.create(
          {
            user: request.nickname,
            action: DATA_ACCESSED,
            subject: AUDIT_SUBJECT.CASE_DETAILS,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            caseId: request.params.id
          },
          transaction
        );

        return await getCaseWithAllAssociations(request.params.id, transaction);
      }
    );
    response.status(200).send(updatedCase);
  }
});

module.exports = editCase;
