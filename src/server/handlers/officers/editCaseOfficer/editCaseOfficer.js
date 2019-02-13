const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
const {
  buildOfficerAttributesForUnknownOfficer,
  buildOfficerAttributesForNewOfficer
} = require("../buildOfficerAttributesHelpers");
const {
  ACCUSED,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
const auditDataAccess = require("../../auditDataAccess");

const editCaseOfficer = asyncMiddleware(async (request, response) => {
  const { officerId, notes, roleOnCase } = request.body;
  const isAnonymous = request.body.isAnonymous
    ? request.body.isAnonymous
    : false;
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
      await models.letter_officer.destroy({
        where: { caseOfficerId: caseOfficerToUpdate.id },
        auditUser: request.nickname,
        transaction
      });
    }

    if (oldRoleOnCase !== ACCUSED && roleOnCase === ACCUSED) {
      await models.letter_officer.create(
        { caseOfficerId: caseOfficerToUpdate.id },
        { auditUser: request.nickname, transaction }
      );
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
        isAnonymous,
        ...officerAttributes
      },
      {
        auditUser: request.nickname,
        transaction
      }
    );

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

module.exports = editCaseOfficer;
