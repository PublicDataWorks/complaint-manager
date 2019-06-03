import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateReferralLetterPdfBuffer from "./generateReferralLetterPdfBuffer";
import throwErrorIfLetterFlowUnavailable from "../throwErrorIfLetterFlowUnavailable";
import legacyAuditDataAccess from "../../../audits/legacyAuditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../../audits/auditDataAccess";

const getReferralLetterPdf = asyncMiddleware(
  async (request, response, next) => {
    const caseId = request.params.caseId;
    await throwErrorIfLetterFlowUnavailable(caseId);
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );
    await models.sequelize.transaction(async transaction => {
      const pdfBufferAndAuditDetails = await generateReferralLetterPdfBuffer(
        caseId,
        false,
        transaction
      );

      const pdfBuffer = pdfBufferAndAuditDetails.pdfBuffer;
      const auditDetails = pdfBufferAndAuditDetails.auditDetails;

      if (newAuditFeatureToggle) {
        await auditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.DRAFT_REFERRAL_LETTER_PDF,
          auditDetails,
          transaction
        );
      } else {
        await legacyAuditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.DRAFT_REFERRAL_LETTER_PDF,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      }

      response.send(pdfBuffer);
    });
  }
);

export default getReferralLetterPdf;
