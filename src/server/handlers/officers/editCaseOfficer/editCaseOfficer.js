import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";

const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
const {
  buildOfficerAttributesForUnknownOfficer,
  buildOfficerAttributesForNewOfficer
} = require("../buildOfficerAttributesHelpers");
const {
  ACCUSED,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../audits/auditDataAccess";

const editCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const { officerId, notes, roleOnCase } = request.body;
  const isAnonymous = !!(roleOnCase !== ACCUSED && request.body.isAnonymous)
  const caseOfficerToUpdate = await models.case_officer.findOne({
    where: {
      id: request.params.caseOfficerId
    }
  });
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const updatedCase = await models.sequelize.transaction(async transaction => {
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

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return caseDetails;
  });

  response.status(200).send(updatedCase);
});

module.exports = editCaseOfficer;
