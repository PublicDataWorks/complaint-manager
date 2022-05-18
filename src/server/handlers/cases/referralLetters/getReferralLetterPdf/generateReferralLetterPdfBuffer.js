import models from "../../../../policeDataManager/models";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import generatePdfBuffer from "../sharedLetterUtilities/generatePdfBuffer";
import fs from "fs";
import Handlebars from "handlebars";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../../audits/getQueryAuditAccessDetails";
import { retrieveSignatureImageBySigner } from "../retrieveSignatureImage";

const LETTER_SETTINGS = {
  hasEditPage: true,
  getSignature: async args => {
    return await retrieveSignatureImageBySigner(args.sender);
  },
  getData: async (args, transaction) => {
    let data = await getReferralLetterPdfData(args, transaction);
    let { referralLetter, caseReference, pibCaseNumber } = data.pdfData;
    let { recipient, recipientAddress, sender, transcribedBy } = referralLetter;
    return {
      data: {
        recipient,
        recipientAddress,
        sender,
        transcribedBy,
        caseReference,
        pibCaseNumber
      },
      auditDetails: data.auditDetails
    };
  }
};

const generateReferralLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction
) => {
  let letterBody, auditDetails;
  if (LETTER_SETTINGS.hasEditPage) {
    const queryOptions = {
      where: { caseId },
      attributes: ["editedLetterHtml"],
      transaction
    };
    let letterData = await models.referral_letter.findOne(queryOptions);
    letterBody = letterData.editedLetterHtml;
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
      auditDetails = letterBodyAndAuditDetails.auditDetails;
    }
  }

  const pdfDataAndAuditDetails = await LETTER_SETTINGS.getData(
    { caseId },
    transaction
  );
  const pdfData = pdfDataAndAuditDetails.data;
  const pdfDataAuditDetails = pdfDataAndAuditDetails.auditDetails;

  const fullLetterHtml = await generateLetterPdfHtml(
    letterBody,
    pdfData,
    includeSignature
  );

  auditDetails = auditDetails
    ? combineAuditDetails(auditDetails, pdfDataAuditDetails)
    : pdfDataAuditDetails;

  return {
    pdfBuffer: await generatePdfBuffer(fullLetterHtml),
    auditDetails: auditDetails
  };
};

const getReferralLetterPdfData = async ({ caseId }, transaction) => {
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

export const generateLetterPdfHtml = async (
  letterBody,
  pdfData,
  includeSignature
) => {
  const currentDate = Date.now();

  let signature = includeSignature
    ? await LETTER_SETTINGS.getSignature({ sender: pdfData.sender })
    : "<p><br></p>";

  const letterPdfData = {
    ...pdfData,
    letterBody,
    signature,
    currentDate
  };

  const rawTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/referralLetterPdf.tpl`
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generateReferralLetterPdfBuffer;
