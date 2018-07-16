const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");

const removeCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const officerToRemove = await models.case_officer.findById(
    request.params.caseOfficerId
  );

  if (officerToRemove === null) {
    next(Boom.badRequest("Case Officer requested for removal does not exist."));
  }

  await models.sequelize.transaction(async transaction => {
    await models.officer_allegation.destroy({
      where: { caseOfficerId: officerToRemove.id },
      auditUser: request.nickname,
      transaction
    });

    await officerToRemove.destroy({
      auditUser: request.nickname,
      transaction
    });

    await models.action_audit.create({
      user: request.nickname,
      action: DATA_ACCESSED,
      subject: AUDIT_SUBJECT.CASE_DETAILS,
      caseId: request.params.caseId,
      auditType: AUDIT_TYPE.DATA_ACCESS
    });
  });

  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);

  response.status(200).send(updatedCase);
});

module.exports = removeCaseOfficer;
