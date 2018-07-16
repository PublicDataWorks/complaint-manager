const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_ACCESSED
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const models = require("../../../models");
const _ = require("lodash");

const createOfficerAllegation = asyncMiddleware(async (request, response) => {
  const allegationAttributes = _.pick(request.body, [
    "allegationId",
    "details"
  ]);

  const caseWithAssociations = await models.sequelize.transaction(
    async transaction => {
      const caseOfficer = await models.case_officer.findById(
        request.params.caseOfficerId,
        { transaction }
      );

      await caseOfficer.createAllegation(
        allegationAttributes,
        {
          auditUser: request.nickname
        },
        { transaction }
      );

      await models.action_audit.create(
        {
          caseId: caseOfficer.caseId,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          action: DATA_ACCESSED,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          user: request.nickname
        },
        { transaction }
      );

      return await getCaseWithAllAssociations(
        request.params.caseId,
        transaction
      );
    }
  );

  return response.status(201).send(caseWithAssociations);
});

module.exports = createOfficerAllegation;
