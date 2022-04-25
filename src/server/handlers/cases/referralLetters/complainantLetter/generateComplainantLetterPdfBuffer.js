import { OFFICER_COMPLAINANT_TITLE } from "../../../../../sharedUtilities/constants";
import fs from "fs";
import Handlebars from "handlebars";
import generatePdfBuffer from "../sharedLetterUtilities/generatePdfBuffer";
import { getPersonType } from "../../../../policeDataManager/models/modelUtilities/getPersonType";
import models from "../../../../policeDataManager/models";
import { includes } from "lodash";
import { retrieveSignatureImage } from "../retrieveSignatureImage";

require("../../../../handlebarHelpers");

const generateComplainantLetterPdfBuffer = async (
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
  const pdfData = await getComplainantLetterPdfData(existingCase, complainant);

  const rawTemplate = fs.readFileSync(
    `${process.env.REACT_APP_INSTANCE_FILES_DIR}/complainantLetterPdf.tpl`
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(pdfData);
};

const getComplainantLetterPdfData = async (existingCase, complainant) => {
  const currentDate = Date.now();

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

  const defaultSigner = await models.letter_types.findOne({
    where: { type: "COMPLAINANT" },
    include: [
      {
        model: models.signers,
        as: "defaultSender",
      }]
  });
  return {
    caseReference: existingCase.caseReference,
    recipientFirstName: complainant.firstName,
    recipientLastName: complainant.lastName,
    currentDate: currentDate,
    complainantAddress: complainant.address ? complainant.address : null,
    complainantEmail: complainant.email ? complainant.email : null,
    firstContactDate: existingCase.firstContactDate,
    title: revisedTitle,
    complainantPersonType: getPersonType(complainant),
    signature: await retrieveSignatureImage(defaultSigner ? defaultSigner.fileName : undefined),
    sender: defaultSigner ? defaultSigner.name + "\n" + defaultSigner.title : ""
  };
};

export default generateComplainantLetterPdfBuffer;
