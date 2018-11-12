import pdf from "html-pdf";
import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import { generateReferralLetterFromCaseData } from "../getLetterPreview/getLetterPreview";

const generatePdf = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  await models.sequelize.transaction(async transaction => {
    const letterHtml = await generateReferralLetterFromCaseData(
      caseId,
      transaction
    );
    const pdfOptions = {
      format: "Letter",
      // phantomPath: "/usr/bin/phantomjs",
      timeout: 100000,
      width: "8.5in",
      height: "11in",
      border: "0.5in",
      header: { height: "1.3 in" },
      footer: { height: "0.7 in" }
    };

    pdf.create(letterHtml, pdfOptions).toBuffer((error, buffer) => {
      response.send(buffer);
    });
  });
});

export default generatePdf;
