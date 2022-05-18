import { OFFICER_COMPLAINANT_TITLE } from "../../../../../sharedUtilities/constants";
import fs from "fs";
import Handlebars from "handlebars";
import generatePdfBuffer from "../sharedLetterUtilities/generatePdfBuffer";
import { getPersonType } from "../../../../policeDataManager/models/modelUtilities/getPersonType";
import models from "../../../../policeDataManager/models";
import { retrieveSignatureImage } from "../retrieveSignatureImage";
import generateReferralLetterPdfBuffer from "../getReferralLetterPdf/generateReferralLetterPdfBuffer";

require("../../../../handlebarHelpers");

const LETTER_SETTINGS = {
  hasEditPage: false,
  getSignature: async ({ sender }) => {
    return await retrieveSignatureImage(
      sender ? sender.signatureFile : undefined
    );
  },
  getData: async args => {
    return {
      data: await getComplainantLetterPdfData(args),
      auditDetails: {}
    };
  },
  templateFile: "complainantLetterPdf.tpl"
};

const generateComplainantLetterPdfBuffer = async (
  existingCase,
  complainant
) => {
  return await models.sequelize.transaction(async transaction => {
    let result = await generateReferralLetterPdfBuffer(
      existingCase.id,
      true,
      transaction,
      LETTER_SETTINGS,
      { caseId: existingCase.id, complainant }
    );
    return result.pdfBuffer;
  });
};

const getComplainantLetterPdfData = async ({ caseId, complainant }) => {
  const currentDate = Date.now();
  const c4se = await models.cases.findByPk(caseId, {
    attributes: ["caseReference", "firstContactDate"]
  });

  let revisedTitle;
  if (complainant.civilianTitle && complainant.civilianTitle.name !== "N/A") {
    revisedTitle = complainant.civilianTitle.name;
  } else if (
    !complainant.civilianTitle ||
    (complainant.civilianTitle.name && complainant.civilianTitle.name === "N/A")
  ) {
    revisedTitle = "";
  } else {
    revisedTitle = OFFICER_COMPLAINANT_TITLE;
  }

  const complainantLetterType = await models.letter_types.findOne({
    where: { type: "COMPLAINANT" },
    include: [
      {
        model: models.signers,
        as: "defaultSender",
        attributes: ["signatureFile", "name", "title"]
      }
    ]
  });

  return {
    caseReference: c4se.caseReference,
    recipientFirstName: complainant.firstName,
    recipientLastName: complainant.lastName,
    currentDate: currentDate,
    complainantAddress: complainant.address ? complainant.address : null,
    complainantEmail: complainant.email ? complainant.email : null,
    firstContactDate: c4se.firstContactDate,
    title: revisedTitle,
    complainantPersonType: getPersonType(complainant),
    signature: await retrieveSignatureImage(
      complainantLetterType
        ? complainantLetterType.defaultSender.signatureFile
        : undefined
    ),
    sender: complainantLetterType
      ? complainantLetterType.defaultSender
      : undefined,
    senderName: complainantLetterType
      ? complainantLetterType.defaultSender.name +
        "\n" +
        complainantLetterType.defaultSender.title
      : ""
  };
};

export default generateComplainantLetterPdfBuffer;
