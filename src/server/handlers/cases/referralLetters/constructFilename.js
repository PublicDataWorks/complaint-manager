import moment from "moment";
import { REFERRAL_LETTER_VERSION } from "../../../../sharedUtilities/constants";

const constructFilename = (
  caseId,
  caseNumber,
  firstContactDate,
  complainantLastName,
  pdfFileType,
  editStatus
) => {
  const formattedFirstContactDate = moment(firstContactDate).format("M-D-YYYY");

  const strippedLastName = complainantLastName
    ? `_${complainantLastName.replace(/[^a-zA-Z]/g, "")}`
    : "";

  if (pdfFileType === REFERRAL_LETTER_VERSION.FINAL) {
    return `${caseId}/${formattedFirstContactDate}_${caseNumber}_PIB_Referral${strippedLastName}.pdf`;
  } else {
    return `${formattedFirstContactDate}_${caseNumber}_${editStatus}_Referral_Draft${strippedLastName}.pdf`;
  }
};

export default constructFilename;
