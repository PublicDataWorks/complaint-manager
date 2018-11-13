import pdf from "html-pdf";
import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateReferralLetterFromCaseData from "../generateReferralLetterFromCaseData";
import fs from "fs";
import Handlebars from "handlebars";
import moment from "moment";

const generatePdf = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  await models.sequelize.transaction(async transaction => {
    const letterBody = await generateReferralLetterFromCaseData(
      caseId,
      transaction
    );

    const addresses = await getAddresses(caseId, transaction);

    const pdfOptions = {
      format: "Letter",
      timeout: 100000,
      width: "8.5in",
      height: "11in",
      border: "0.5in",
      header: { height: "1.3 in" },
      footer: { height: "0.7 in" },
      base:
        "file:///app/src/server/handlers/cases/referralLetters/generatePdf/assets/"
    };

    const letterHtml = await generateLetterPdfHtml(letterBody, addresses);

    pdf.create(letterHtml, pdfOptions).toBuffer((error, buffer) => {
      response.send(buffer);
    });
  });
});

const getAddresses = async (caseId, transaction) => {
  return await models.referral_letter.find({
    where: { caseId: caseId },
    attributes: ["recipient", "sender"],
    transaction
  });
};

const generateLetterPdfHtml = (letterBody, addresses) => {
  const currentDate = moment(Date.now()).format("MMMM DD, YYYY");

  const letterPdfData = {
    letterBody: letterBody,
    recipient: addresses.recipient,
    sender: addresses.sender,
    currentDate
  };

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/generatePdf/letterPdf.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generatePdf;
