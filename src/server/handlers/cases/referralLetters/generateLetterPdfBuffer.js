import models from "../../../policeDataManager/models";
import { generateReferralLetterBodyAndAuditDetails } from "./generateReferralLetterBodyAndAuditDetails";
import generatePdfBuffer from "./sharedLetterUtilities/generatePdfBuffer";
import fs from "fs";
import Handlebars from "handlebars";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../audits/getQueryAuditAccessDetails";
require("../../../handlebarHelpers");
import { retrieveLetterImage } from "./retrieveLetterImage";

const generateLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction,
  letterSettings,
  getDataArgs
) => {
  let letterBody, auditDetails;

  const letterType = await models.letter_types.findOne({
    where: { type: letterSettings.type }
  });

  if (letterType.editableTemplate) {
    const queryOptions = {
      where: { caseId },
      attributes: ["editedLetterHtml"],
      transaction
    };
    let letterData = await models.referral_letter.findOne(queryOptions);
    letterBody = letterData.editedLetterHtml;

    ({ html: letterBody, auditDetails } = await determineLetterBody(
      letterBody,
      () =>
        getQueryAuditAccessDetails(queryOptions, models.referral_letter.name),
      letterType,
      caseId,
      transaction
    ));
  }

  const pdfDataAndAuditDetails = await letterSettings.getData(
    getDataArgs || { caseId },
    transaction
  );
  const pdfData = pdfDataAndAuditDetails.data;
  const pdfDataAuditDetails = pdfDataAndAuditDetails.auditDetails;

  const fullLetterHtml = await generateLetterPdfHtml(
    letterBody,
    pdfData,
    includeSignature,
    letterSettings,
    letterType.template
  );

  auditDetails = auditDetails
    ? combineAuditDetails(auditDetails, pdfDataAuditDetails)
    : pdfDataAuditDetails;

  return {
    pdfBuffer: await generatePdfBuffer(fullLetterHtml),
    auditDetails: auditDetails
  };
};

export const generateLetterPdfHtml = async (
  letterBody,
  pdfData,
  includeSignature,
  letterSettings,
  template
) => {
  const currentDate = Date.now();

  let signature = includeSignature
    ? await letterSettings.getSignature({ sender: pdfData.sender })
    : "<p><br></p>";
  let header = await retrieveLetterImage("header_text.png", "max-width: 223px");
  let smallIcon = await retrieveLetterImage("icon.ico", "max-width: 30px");
  let largeIcon = await retrieveLetterImage("icon.ico", "max-width: 42px");

  const letterPdfData = {
    ...pdfData,
    letterBody,
    signature,
    currentDate,
    header,
    smallIcon,
    largeIcon
  };

  const compiledTemplate = Handlebars.compile(template);
  return compiledTemplate(letterPdfData);
};

export const determineLetterBody = async (
  letterBody,
  auditIfEdited,
  letterType,
  caseId,
  transaction
) => {
  let auditDetails, html;
  if (letterBody) {
    html = letterBody;
    auditDetails = auditIfEdited();
  } else {
    const letterBodyAndAuditDetails =
      await generateReferralLetterBodyAndAuditDetails(
        caseId,
        letterType.editableTemplate,
        transaction
      );
    html = letterBodyAndAuditDetails.referralLetterBody;
    auditDetails = letterBodyAndAuditDetails.auditDetails;
  }
  return { html, auditDetails };
};

export default generateLetterPdfBuffer;
