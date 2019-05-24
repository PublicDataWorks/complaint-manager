import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";

const {
  buildOfficerAttributesForNewOfficer,
  buildOfficerAttributesForUnknownOfficer
} = require("../buildOfficerAttributesHelpers");

const models = require("../../../models/index");
const asyncMiddleware = require("../../asyncMiddleware");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const addCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const { officerId, notes, roleOnCase } = request.body;
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const retrievedCase = await models.cases.findByPk(request.params.caseId);
  const referralLetter = await models.referral_letter.findOne({
    where: { caseId: request.params.caseId }
  });

  let caseOfficerAttributes = {};
  if (!officerId) {
    caseOfficerAttributes = buildOfficerAttributesForUnknownOfficer();
  } else {
    caseOfficerAttributes = await buildOfficerAttributesForNewOfficer(
      officerId
    );
  }

  const updatedCase = await models.sequelize.transaction(async transaction => {
    const createdCaseOfficer = await retrievedCase.createAccusedOfficer(
      { notes, roleOnCase, ...caseOfficerAttributes },
      {
        transaction,
        auditUser: request.nickname
      }
    );

    if (referralLetter) {
      await models.letter_officer.create(
        { caseOfficerId: createdCaseOfficer.id },
        { transaction, auditUser: request.nickname }
      );
    }

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      retrievedCase.id,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const auditDetails = caseDetailsAndAuditDetails.auditDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        retrievedCase.id,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        retrievedCase.id,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return caseDetails;
  });

  return response.send(updatedCase);
});

module.exports = addCaseOfficer;
