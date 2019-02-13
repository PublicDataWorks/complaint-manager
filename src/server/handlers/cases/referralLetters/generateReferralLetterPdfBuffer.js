import models from "../../../models";
import generateLetterBody from "./generateLetterBody";
import generatePdfBuffer from "./sharedLetterUtilities/generatePdfBuffer";
import fs from "fs";
import Handlebars from "handlebars";

const generateReferralLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction
) => {
  let letterData = await models.referral_letter.findOne({
    where: { caseId: caseId },
    attributes: ["editedLetterHtml"],
    transaction
  });
  let letterBody = letterData.editedLetterHtml;

  if (!letterBody) {
    letterBody = await generateLetterBody(caseId, transaction);
  }

  const pdfData = await getReferralLetterPdfData(caseId, transaction);

  const fullLetterHtml = await generateLetterPdfHtml(
    letterBody,
    pdfData,
    includeSignature
  );

  return await generatePdfBuffer(fullLetterHtml);
};

const getReferralLetterPdfData = async (caseId, transaction) => {
  return await models.cases.findByPk(caseId, {
    attributes: [
      "firstContactDate",
      "complaintType",
      "id",
      "year",
      "caseNumber",
      "pibCaseNumber"
    ],
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

export const generateLetterPdfHtml = (
  letterBody,
  pdfData,
  includeSignature
) => {
  const currentDate = Date.now();

  const letterPdfData = {
    letterBody: letterBody,
    recipient: pdfData.referralLetter.recipient,
    sender: pdfData.referralLetter.sender,
    transcribedBy: pdfData.referralLetter.transcribedBy,
    caseReference: pdfData.caseReference,
    pibCaseNumber: pdfData.pibCaseNumber,
    includeSignature,
    currentDate
  };

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/getPdf/letterPdf.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generateReferralLetterPdfBuffer;
