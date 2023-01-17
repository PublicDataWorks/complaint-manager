import _ from "lodash";
import moment from "moment";
import {
  COMPLAINANT_LETTER,
  REFERRAL_LETTER_VERSION
} from "../../../../sharedUtilities/constants";
import { getPrimaryComplainantTuple } from "./approveLetter/generateComplainantLetterAndUploadToS3";

const constructFilename = (existingCase, pdfLetterType, editStatus) => {
  const formattedFirstContactDate = moment(
    existingCase.firstContactDate
  ).format("M-D-YYYY");
  const complainantTuple = getPrimaryComplainantTuple(existingCase);

  const primaryComplainant = complainantTuple.primaryComplainant;

  let complainantLastName = getComplainantLastName(primaryComplainant);

  if (pdfLetterType === REFERRAL_LETTER_VERSION.FINAL) {
    if (primaryComplainant && primaryComplainant.isAnonymous) {
      complainantLastName = "_Anonymous";
    }
    return `${formattedFirstContactDate}_${existingCase.caseReference}_PIB_Referral${complainantLastName}.pdf`;
  } else if (pdfLetterType === REFERRAL_LETTER_VERSION.DRAFT) {
    if (primaryComplainant && primaryComplainant.isAnonymous) {
      complainantLastName = "_Anonymous";
    }
    return `${formattedFirstContactDate}_${existingCase.caseReference}_${editStatus}_Referral_Draft${complainantLastName}.pdf`;
  } else if (pdfLetterType === COMPLAINANT_LETTER) {
    return `${formattedFirstContactDate}_${existingCase.caseReference}_Letter_to_Complainant${complainantLastName}.pdf`;
  } else {
    return `${formattedFirstContactDate}_${existingCase.caseReference}_${pdfLetterType}.pdf`;
  }
};

const getComplainantLastName = complainant => {
  if (!complainant) {
    return "";
  } else if (complainant.isUnknownOfficer) {
    return "_Unknown_Officer";
  } else if (!complainant.lastName) {
    return "";
  }
  return sanitizeName(complainant.lastName);
};

const sanitizeName = name => {
  return `_${name.replace(/[^a-zA-Z]/g, "")}`;
};

export const firstCreated = list => {
  return _.sortBy(list, ["createdAt"])[0];
};

export default constructFilename;
