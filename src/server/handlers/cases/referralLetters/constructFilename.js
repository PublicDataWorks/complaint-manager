import moment from "moment";
import _ from "lodash";
import {
  CIVILIAN_INITIATED,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";

const constructFilename = (existingCase, pdfFileVersion, editStatus) => {
  const formattedFirstContactDate = moment(
    existingCase.firstContactDate
  ).format("M-D-YYYY");
  const firstComplainantLastName = getFirstComplainantLastName(existingCase);

  if (pdfFileVersion === REFERRAL_LETTER_VERSION.FINAL) {
    return `${existingCase.id}/${formattedFirstContactDate}_${
      existingCase.caseNumber
    }_PIB_Referral${firstComplainantLastName}.pdf`;
  } else {
    return `${formattedFirstContactDate}_${
      existingCase.caseNumber
    }_${editStatus}_Referral_Draft${firstComplainantLastName}.pdf`;
  }
};

const getFirstComplainantLastName = existingCase => {
  const firstComplainant = getFirstComplainant(existingCase);
  return firstComplainant ? sanitizeName(firstComplainant.lastName) : "";
};

const sanitizeName = name => {
  return `_${name.replace(/[^a-zA-Z]/g, "")}`;
};

const getFirstComplainant = existingCase => {
  return existingCase.complaintType === CIVILIAN_INITIATED
    ? firstCreated(existingCase.complainantCivilians)
    : firstCreated(existingCase.complainantOfficers);
};

const firstCreated = list => {
  return _.sortBy(list, ["createdAt"])[0];
};

export default constructFilename;
