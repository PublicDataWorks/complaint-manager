import models from "../../../policeDataManager/models";
import { generateReferralLetterBodyAndAuditDetails } from "./generateReferralLetterBodyAndAuditDetails";
import generatePdfBuffer from "./sharedLetterUtilities/generatePdfBuffer";
import fs from "fs";
import Handlebars from "handlebars";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../audits/getQueryAuditAccessDetails";
require("../../../handlebarHelpers");
import { retrieveLetterImage } from "./retrieveLetterImage"

const generateLetterPdfBuffer = async (
  caseId,
  includeSignature,
  transaction,
  letterSettings,
  getDataArgs
) => {
  let letterBody, auditDetails;
  if (letterSettings.hasEditPage) {
    const queryOptions = {
      where: { caseId },
      attributes: ["editedLetterHtml"],
      transaction
    };
    let letterData = await models.referral_letter.findOne(queryOptions);
    letterBody = letterData.editedLetterHtml;

    if (letterBody) {
      auditDetails = getQueryAuditAccessDetails(
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
    letterSettings
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
  letterSettings
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

  const rawTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/${letterSettings.templateFile}`
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(letterPdfData);
};

export default generateLetterPdfBuffer;
