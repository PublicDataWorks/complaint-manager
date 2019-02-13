import models from "../../../../models/index";
import generateLetterBody from "../generateLetterBody";
import pdf from "html-pdf";
import util from "util";
import Handlebars from "handlebars";
require("../../../../handlebarHelpers");
import fs from "fs";
import { OFFICER_COMPLAINANT_TITLE } from "../../../../../sharedUtilities/constants";

const generatePdfBuffer = async letterHtml => {
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

  let pdfCreator = pdf.create(letterHtml, pdfOptions);
  let pdfToBuffer = util.promisify(pdfCreator.toBuffer.bind(pdfCreator));

  return await pdfToBuffer();
};

export const generateComplainantLetterPdfBuffer = async (
  existingCase,
  complainant
) => {
  const letterHtml = await generateComplainantLetterHtml(
    existingCase,
    complainant
  );
  return await generatePdfBuffer(letterHtml);
};

export const generateComplainantLetterHtml = async (
  existingCase,
  complainant
) => {
  const pdfData = getComplainantLetterPdfData(existingCase, complainant);

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/approveLetter/complainantLetterPdf.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(pdfData);
};

export const generateReferralLetterPdfBuffer = async (
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

const getComplainantLetterPdfData = (existingCase, complainant) => {
  const currentDate = Date.now();

  let revisedTitle;
  if (complainant.title && complainant.title !== "N/A") {
    revisedTitle = complainant.title;
  } else if (
    !complainant.title ||
    (complainant.title && complainant.title === "N/A")
  ) {
    revisedTitle = "";
  } else {
    revisedTitle = OFFICER_COMPLAINANT_TITLE;
  }

  return {
    caseReference: existingCase.caseReference,
    recipient: complainant,
    currentDate: currentDate,
    complainantAddress: complainant.address ? complainant.address : null,
    complainantEmail: complainant.email ? complainant.email : null,
    firstContactDate: existingCase.firstContactDate,
    title: revisedTitle
  };
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
