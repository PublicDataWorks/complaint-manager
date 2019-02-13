import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateReferralLetterPdfBuffer from "../generateReferralLetterPdfBuffer";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import auditDataAccess from "../../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";

const getPdf = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  await throwErrorIfLetterFlowUnavailable(caseId);
  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );
    const pdfBuffer = await generateReferralLetterPdfBuffer(
      caseId,
      false,
      transaction
    );
    response.send(pdfBuffer);
  });
});

export default getPdf;
