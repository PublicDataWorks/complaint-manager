import getReferralLetterDataForResponse from "./getReferralLetterDataForResponse";
import asyncMiddleware from "../../../asyncMiddleware";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import { AUDIT_SUBJECT } from "../../../../../sharedUtilities/constants";
import models from "../../../../complaintManager/models";
import auditDataAccess from "../../../audits/auditDataAccess";

const getReferralLetterData = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  await throwErrorIfLetterFlowUnavailable(caseId);

  await models.sequelize.transaction(async transaction => {
    const transformedLetterDataAndAuditDetails = await getReferralLetterDataForResponse(
      caseId,
      transaction
    );
    const transformedLetterData =
      transformedLetterDataAndAuditDetails.referralLetterData;
    const auditDetails = transformedLetterDataAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER_DATA,
      auditDetails,
      transaction
    );
    response.send(transformedLetterData);
  });
});

module.exports = getReferralLetterData;
