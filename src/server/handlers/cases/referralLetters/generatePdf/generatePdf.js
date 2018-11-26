import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateFullReferralLetterPdf from "../sharedReferralLetter/generateFullReferralLetterPdf";
import checkForValidStatus from "../checkForValidStatus";

const generatePdf = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  await checkForValidStatus(caseId);
  await models.sequelize.transaction(async transaction => {
    const pdfBuffer = await generateFullReferralLetterPdf(caseId, transaction);
    response.send(pdfBuffer);
  });
});

export default generatePdf;
