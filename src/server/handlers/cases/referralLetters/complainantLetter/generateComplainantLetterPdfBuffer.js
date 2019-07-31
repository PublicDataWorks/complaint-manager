import { OFFICER_COMPLAINANT_TITLE } from "../../../../../sharedUtilities/constants";
import fs from "fs";
import Handlebars from "handlebars";
import generatePdfBuffer from "../sharedLetterUtilities/generatePdfBuffer";

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
  const pdfData = getComplainantLetterPdfData(existingCase, complainant);

  const rawTemplate = fs.readFileSync(
    "src/server/handlers/cases/referralLetters/complainantLetter/complainantLetterPdf.tpl"
  );
  const compiledTemplate = Handlebars.compile(rawTemplate.toString());
  return compiledTemplate(pdfData);
};

const getComplainantLetterPdfData = (existingCase, complainant) => {
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

export default generateComplainantLetterPdfBuffer;
