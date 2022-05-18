import models from "../../../../policeDataManager/models";
import { generateReferralLetterBodyAndAuditDetails } from "../generateReferralLetterBodyAndAuditDetails";
import generatePdfBuffer from "../sharedLetterUtilities/generatePdfBuffer";
import fs from "fs";
import Handlebars from "handlebars";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../../audits/getQueryAuditAccessDetails";
import { retrieveSignatureImageBySigner } from "../retrieveSignatureImage";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";

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
  },
  templateFile: "referralLetterPdf.tpl"
};

const generateReferralLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction
) => {
  return await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction,
    LETTER_SETTINGS
  );
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

export default generateReferralLetterPdfBuffer;
