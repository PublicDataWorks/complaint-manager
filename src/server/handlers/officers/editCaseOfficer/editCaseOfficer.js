const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
const getCaseWithAllAssociations = require("../../getCaseWithAllAssociations");
const {
  buildOfficerAttributesForUnknownOfficer,
  buildOfficerAttributesForNewOfficer
} = require("../buildOfficerAttributesHelpers");
const {
  ACCUSED,
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");

const editCaseOfficer = asyncMiddleware(async (request, response) => {
  const { officerId, notes, roleOnCase } = request.body;
  const caseOfficerToUpdate = await models.case_officer.findOne({
    where: {
      id: request.params.caseOfficerId
    }
  });

  await models.sequelize.transaction(async transaction => {
    const oldRoleOnCase = caseOfficerToUpdate.roleOnCase;
    if (oldRoleOnCase === ACCUSED && roleOnCase !== ACCUSED) {
      await models.officer_allegation.destroy({
        where: { caseOfficerId: caseOfficerToUpdate.id },
        auditUser: request.nickname,
        transaction
      });
    }

    let officerAttributes = {};
    if (!officerId) {
      officerAttributes = buildOfficerAttributesForUnknownOfficer();
    } else if (officerId !== caseOfficerToUpdate.officerId) {
      officerAttributes = await buildOfficerAttributesForNewOfficer(officerId);
    }

    await caseOfficerToUpdate.update(
      {
        notes,
        roleOnCase,
        ...officerAttributes
      },
      {
        auditUser: request.nickname,
        transaction
      }
    );

    await models.action_audit.create(
      {
        caseId: request.params.caseId,
        user: request.nickname,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        action: DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS
      },
      transaction
    );
  });

  const updatedCase = await getCaseWithAllAssociations(request.params.caseId);
  response.status(200).send(updatedCase);
});

module.exports = editCaseOfficer;
