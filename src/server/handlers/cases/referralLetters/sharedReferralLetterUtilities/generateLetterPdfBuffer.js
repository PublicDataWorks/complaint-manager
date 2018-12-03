import models from "../../../../models/index";
import generateLetterBody from "../generateLetterBody";
import pdf from "html-pdf";
import util from "util";
import Handlebars from "handlebars";
require("../../../../handlebarHelpers");
import fs from "fs";

const generateLetterPdfBuffer = async (caseId, transaction) => {
  let letterData = await models.referral_letter.find({
    where: { caseId: caseId },
    attributes: ["editedLetterHtml"],
    transaction
  });
  let letterBody = letterData.editedLetterHtml;

  if (!letterBody) {
    letterBody = await generateLetterBody(caseId, transaction);
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
    base: "file:///app/src/server/handlers/cases/referralLetters/getPdf/assets/"
  };

  const fullLetterHtml = await generateLetterPdfHtml(letterBody, pdfData);

  let pdfCreator = pdf.create(fullLetterHtml, pdfOptions);
  let pdfToBuffer = util.promisify(pdfCreator.toBuffer.bind(pdfCreator));

  return await pdfToBuffer();
};

const getPdfData = async (caseId, transaction) => {
  return await models.cases.findById(caseId, {
    attributes: ["incidentDate", "complaintType", "id", "status"],
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

export const generateLetterPdfHtml = (letterBody, pdfData) => {
  const currentDate = Date.now();

  const letterPdfData = {
    letterBody: letterBody,
    recipient: pdfData.referralLetter.recipient,
    sender: pdfData.referralLetter.sender,
    transcribedBy: pdfData.referralLetter.transcribedBy,
    caseNumber: pdfData.caseNumber,
    caseStatus: pdfData.status,
    currentDate
  };

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/getPdf/letterPdf.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generateLetterPdfBuffer;
