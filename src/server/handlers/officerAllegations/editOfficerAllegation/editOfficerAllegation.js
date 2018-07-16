const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const {
  DATA_ACCESSED,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} = require("../../../../sharedUtilities/constants");

const editOfficerAllegation = asyncMiddleware(async (request, response) => {
  const updatedCase = await models.sequelize.transaction(async transaction => {
    const officerAllegation = await models.officer_allegation.findById(
      request.params.officerAllegationId,
      { transaction }
    );

    if (!officerAllegation) {
      throw Boom.notFound("Officer Allegation does not exist");
    }

    const newDetails = request.body.details;

    await officerAllegation.update(
      { details: newDetails },
      {
        auditUser: request.nickname,
        transaction
      }
    );

    const caseOfficer = await officerAllegation.getCaseOfficer({ transaction });

    await models.action_audit.create(
      {
        user: request.nickname,
        action: DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        caseId: caseOfficer.caseId,
        subject: AUDIT_SUBJECT.CASE_DETAILS
      },
      { transaction }
    );

    return await getCaseWithAllAssociations(caseOfficer.caseId, transaction);
  });

  response.status(200).send(updatedCase);
});

module.exports = editOfficerAllegation;
