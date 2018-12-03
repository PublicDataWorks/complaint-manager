import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateLetterPdfBuffer from "../sharedReferralLetterUtilities/generateLetterPdfBuffer";
import checkForValidStatus from "../checkForValidStatus";
import auditDataAccess from "../../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";

const getPdf = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  await checkForValidStatus(caseId);
  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );

    const pdfBuffer = await generateLetterPdfBuffer(caseId, transaction);
    response.send(pdfBuffer);
  });
});

export default getPdf;
