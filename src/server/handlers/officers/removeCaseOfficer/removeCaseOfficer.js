const models = require("../../../models");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

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

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );
  });

  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);

  response.status(200).send(updatedCase);
});

module.exports = removeCaseOfficer;
