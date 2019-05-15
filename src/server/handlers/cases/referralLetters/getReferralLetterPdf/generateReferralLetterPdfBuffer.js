import models from "../../../../models";
import generateReferralLetterBody from "../generateReferralLetterBody";
import generatePdfBuffer from "../sharedLetterUtilities/generatePdfBuffer";
import fs from "fs";
import Handlebars from "handlebars";
import { generateAndAddAuditDetailsFromQuery } from "../../../getQueryAuditAccessDetails";

const generateReferralLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction,
  auditDetails = null
) => {
  const queryOptions = {
    where: { caseId: caseId },
    attributes: ["editedLetterHtml"],
    transaction
  };
  let letterData = await models.referral_letter.findOne(queryOptions);
  let letterBody = letterData.editedLetterHtml;

  if (!letterBody) {
    letterBody = await generateReferralLetterBody(
      caseId,
      transaction,
      auditDetails
    );
  } else {
    generateAndAddAuditDetailsFromQuery(
      auditDetails,
      queryOptions,
      models.referral_letter.name
    );
  }

  const pdfData = await getReferralLetterPdfData(
    caseId,
    transaction,
    auditDetails
  );

  const fullLetterHtml = await generateLetterPdfHtml(
    letterBody,
    pdfData,
    includeSignature
  );

  return await generatePdfBuffer(fullLetterHtml);
};

const getReferralLetterPdfData = async (caseId, transaction, auditDetails) => {
  const queryOptions = {
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
  };
  const caseData = await models.cases.findByPk(caseId, queryOptions);

  generateAndAddAuditDetailsFromQuery(
    auditDetails,
    queryOptions,
    models.cases.name
  );

  return caseData;
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
    "src/server/handlers/cases/referralLetters/getReferralLetterPdf/referralLetterPdf.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generateReferralLetterPdfBuffer;
