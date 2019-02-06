import moment from "moment";
import _ from "lodash";
import {
  CIVILIAN_INITIATED,
  COMPLAINANT_LETTER,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";

const constructFilename = (existingCase, pdfLetterType, editStatus) => {
  const formattedFirstContactDate = moment(
    existingCase.firstContactDate
  ).format("M-D-YYYY");
  const firstComplainantLastName = getFirstComplainantLastName(existingCase);

  if (pdfLetterType === REFERRAL_LETTER_VERSION.FINAL) {
    return `${existingCase.id}/${formattedFirstContactDate}_${
      existingCase.caseReference
    }_PIB_Referral${firstComplainantLastName}.pdf`;
  } else if (pdfLetterType === REFERRAL_LETTER_VERSION.DRAFT) {
    return `${formattedFirstContactDate}_${
      existingCase.caseReference
    }_${editStatus}_Referral_Draft${firstComplainantLastName}.pdf`;
  } else if (pdfLetterType === COMPLAINANT_LETTER) {
    return `${formattedFirstContactDate}_${
      existingCase.caseReference
    }_Letter_to_Complainant${firstComplainantLastName}.pdf`;
  }
};

const getFirstComplainantLastName = existingCase => {
  const firstComplainant = getFirstComplainant(existingCase);
  if (!firstComplainant) {
    return "";
  }
  if (firstComplainant.isUnknownOfficer) {
    return "_Unknown_Officer";
  }
  return sanitizeName(firstComplainant.lastName);
};

const sanitizeName = name => {
  return `_${name.replace(/[^a-zA-Z]/g, "")}`;
};

const getFirstComplainant = existingCase => {
  return existingCase.complaintType === CIVILIAN_INITIATED
    ? firstCreated(existingCase.complainantCivilians)
    : firstCreated(existingCase.complainantOfficers);
};

export const firstCreated = list => {
  return _.sortBy(list, ["createdAt"])[0];
};

export default constructFilename;
