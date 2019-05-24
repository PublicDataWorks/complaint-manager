import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import auditDataAccess from "../../auditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";

const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const getCase = asyncMiddleware(async (request, response) => {
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const singleCase = await models.sequelize.transaction(async transaction => {
    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const caseWithAssociations = caseDetailsAndAuditDetails.caseDetails;
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

    return caseWithAssociations;
  });

  response.send(singleCase);
});

module.exports = getCase;
