import pdf from "html-pdf";
import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import generateReferralLetterFromCaseData from "../generateReferralLetterFromCaseData";
import fs from "fs";
import Handlebars from "handlebars";
import moment from "moment";
require("../../../../handlebarHelpers");

const generatePdf = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  await models.sequelize.transaction(async transaction => {
    let letterData = await models.referral_letter.find({
      where: { caseId: caseId },
      attributes: ["editedLetterHtml"],
      transaction
    });

    let letterBody = letterData.editedLetterHtml;

    if (!letterBody) {
      letterBody = await generateReferralLetterFromCaseData(
        caseId,
        transaction
      );
    }

    const pdfData = await getPdfData(caseId, transaction);

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

    const letterHtml = await generateLetterPdfHtml(letterBody, pdfData, caseId);

    pdf.create(letterHtml, pdfOptions).toBuffer((error, buffer) => {
      response.send(buffer);
    });
  });
});

const getPdfData = async (caseId, transaction) => {
  return await models.cases.findById(caseId, {
    attributes: ["incidentDate", "complaintType"],
    include: [
      {
        model: models.referral_letter,
        as: "referralLetter",
        attributes: ["recipient", "sender", "transcribedBy"]
      }
    ],
    transaction
  });
};

export const generateLetterPdfHtml = (letterBody, pdfData, caseId) => {
  const currentDate = moment(Date.now()).format("MMMM DD, YYYY");

  const letterPdfData = {
    letterBody: letterBody,
    recipient: pdfData.referralLetter.recipient,
    sender: pdfData.referralLetter.sender,
    transcribedBy: pdfData.referralLetter.transcribedBy,
    complaintType: pdfData.complaintType,
    incidentDate: pdfData.incidentDate,
    caseId,
    currentDate
  };

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/generatePdf/letterPdf.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generatePdf;
