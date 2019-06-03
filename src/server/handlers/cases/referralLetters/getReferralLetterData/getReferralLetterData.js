import getReferralLetterDataForResponse from "./getReferralLetterDataForResponse";
import asyncMiddleware from "../../../asyncMiddleware";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../../../audits/legacyAuditDataAccess";
import models from "../../../../models";
import checkFeatureToggleEnabled from "../../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../../audits/auditDataAccess";

const getReferralLetterData = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  await throwErrorIfLetterFlowUnavailable(caseId);
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  await models.sequelize.transaction(async transaction => {
    const transformedLetterDataAndAuditDetails = await getReferralLetterDataForResponse(
      caseId,
      transaction
    );
    const transformedLetterData =
      transformedLetterDataAndAuditDetails.referralLetterData;
    const auditDetails = transformedLetterDataAndAuditDetails.auditDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    response.send(transformedLetterData);
  });
});

module.exports = getReferralLetterData;
