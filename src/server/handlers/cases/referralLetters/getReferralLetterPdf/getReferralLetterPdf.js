import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateReferralLetterPdfBuffer from "./generateReferralLetterPdfBuffer";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import legacyAuditDataAccess from "../../../legacyAuditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";

const getReferralLetterPdf = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);
    await models.sequelize.transaction(async transaction => {
      let auditDetails = {};
      const pdfBuffer = await generateReferralLetterPdfBuffer(
        caseId,
        false,
        transaction,
        auditDetails
      );

      await legacyAuditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.DRAFT_REFERRAL_LETTER_PDF,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );

      response.send(pdfBuffer);
    });
  }
);

export default getReferralLetterPdf;
