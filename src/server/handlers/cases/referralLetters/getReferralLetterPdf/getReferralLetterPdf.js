import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../complaintManager/models";
import generateReferralLetterPdfBuffer from "./generateReferralLetterPdfBuffer";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import { AUDIT_FILE_TYPE } from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../audits/auditDataAccess";

const getReferralLetterPdf = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);
    await models.sequelize.transaction(async transaction => {
      const pdfBufferAndAuditDetails = await generateReferralLetterPdfBuffer(
        caseId,
        false,
        transaction
      );

      const pdfBuffer = pdfBufferAndAuditDetails.pdfBuffer;
      const auditDetails = pdfBufferAndAuditDetails.auditDetails;

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_FILE_TYPE.DRAFT_REFERRAL_LETTER_PDF,
        auditDetails,
        transaction
      );

      response.send(pdfBuffer);
    });
  }
);

export default getReferralLetterPdf;
