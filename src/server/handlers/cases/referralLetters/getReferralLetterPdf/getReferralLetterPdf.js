import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../policeDataManager/models";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import {
  AUDIT_FILE_TYPE,
  MANAGER_TYPE
} from "../../../../../sharedUtilities/constants";
import auditDataAccess from "../../../audits/auditDataAccess";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";
import { retrieveSignatureImageBySigner } from "../retrieveSignatureImage";

const getReferralLetterPdf = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);
    await models.sequelize.transaction(async transaction => {
      const pdfBufferAndAuditDetails = await generateLetterPdfBuffer(
        caseId,
        false,
        transaction,
        {
          getSignature: async args => {
            return await retrieveSignatureImageBySigner(args.sender);
          },
          type: "REFERRAL"
        }
      );

      const pdfBuffer = pdfBufferAndAuditDetails.pdfBuffer;
      const auditDetails = pdfBufferAndAuditDetails.auditDetails;

      await auditDataAccess(
        request.nickname,
        caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_FILE_TYPE.DRAFT_REFERRAL_LETTER_PDF,
        auditDetails,
        transaction
      );

      response.send(pdfBuffer);
    });
  }
);

export default getReferralLetterPdf;
