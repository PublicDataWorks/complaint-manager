import models from "../../../../policeDataManager/models";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import generatePdfBuffer from "../sharedLetterUtilities/generatePdfBuffer";
import fs from "fs";
import Handlebars from "handlebars";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../../audits/getQueryAuditAccessDetails";

const generateReferralLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction
) => {
  const queryOptions = {
    where: { caseId: caseId },
    attributes: ["editedLetterHtml"],
    transaction
  };
  let letterData = await models.referral_letter.findOne(queryOptions);
  let letterBody = letterData.editedLetterHtml;
  let letterBodyAuditDetails;

  if (letterBody) {
    letterBodyAuditDetails = getQueryAuditAccessDetails(
      queryOptions,
      models.referral_letter.name
    );
  } else {
    const letterBodyAndAuditDetails =
      await generateReferralLetterBodyAndAuditDetails(caseId, transaction);
    letterBody = letterBodyAndAuditDetails.referralLetterBody;
    letterBodyAuditDetails = letterBodyAndAuditDetails.auditDetails;
  }

  const pdfDataAndAuditDetails = await getReferralLetterPdfData(
    caseId,
    transaction
  );
  const pdfData = pdfDataAndAuditDetails.pdfData;
  const pdfDataAuditDetails = pdfDataAndAuditDetails.auditDetails;

  const fullLetterHtml = await generateLetterPdfHtml(
    letterBody,
    pdfData,
    includeSignature
  );

  const auditDetails = combineAuditDetails(
    letterBodyAuditDetails,
    pdfDataAuditDetails
  );

  return {
    pdfBuffer: await generatePdfBuffer(fullLetterHtml),
    auditDetails: auditDetails
  };
};

const getReferralLetterPdfData = async (caseId, transaction) => {
  const queryOptions = {
    attributes: [
      "primaryComplainant",
      "firstContactDate",
      "complaintType",
      "id",
      "year",
      "caseNumber",
      "caseReference",
      "pibCaseNumber"
    ],
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians"
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.referral_letter,
        as: "referralLetter",
        attributes: ["recipient", "recipientAddress", "sender", "transcribedBy"]
      }
    ],
    transaction
  };
  const caseData = await models.cases.findByPk(caseId, queryOptions);

  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.cases.name
  );

  return { pdfData: caseData, auditDetails: auditDetails };
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
    recipientAddress: pdfData.referralLetter.recipientAddress,
    sender: pdfData.referralLetter.sender,
    transcribedBy: pdfData.referralLetter.transcribedBy,
    caseReference: pdfData.caseReference,
    pibCaseNumber: pdfData.pibCaseNumber,
    includeSignature,
    currentDate
  };

  const rawTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterPdf.tpl`
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generateReferralLetterPdfBuffer;
