import {
  AUDIT_SUBJECT,
  COMPLAINANT_LETTER
} from "../../../../../sharedUtilities/constants";
import constructFilename from "../constructFilename";
import generateComplainantLetterPdfBuffer from "../complainantLetter/generateComplainantLetterPdfBuffer";
import models from "../../../../models";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import auditUpload from "../sharedLetterUtilities/auditUpload";
import config from "../../../../config/config";

const CIVILIAN = "CIVILIAN";
const OFFICER = "OFFICER";

const generateComplainantLetterAndUploadToS3 = async (
  existingCase,
  nickname,
  transaction
) => {
  const caseId = existingCase.id;

  const primaryComplainant = getFirstComplainant(existingCase);

  const finalPdfFilename = constructFilename(existingCase, COMPLAINANT_LETTER);
  let createdComplainantLetter = await models.complainant_letter.create(
    {
      caseId: caseId,
      finalPdfFilename: finalPdfFilename,
      complainantCivilianId:
        primaryComplainant.complainantType === CIVILIAN
          ? primaryComplainant.complainant.id
          : null,
      complainantOfficerId:
        primaryComplainant.complainantType === OFFICER
          ? primaryComplainant.complainant.id
          : null
    },
    { auditUser: nickname, transaction }
  );
  const pdfBuffer = await generateComplainantLetterPdfBuffer(
    existingCase,
    primaryComplainant.complainant
  );

  const fullFilenameWithKey = `${existingCase.id}/${finalPdfFilename}`;
  uploadLetterToS3(
    fullFilenameWithKey,
    pdfBuffer,
    config[process.env.NODE_ENV].complainantLettersBucket
  );
  await auditUpload(
    nickname,
    caseId,
    AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
    transaction
  );
  return createdComplainantLetter;
};

const getFirstComplainant = existingCase => {
  const primaryComplainant = existingCase.primaryComplainant;
  return {
    complainant: primaryComplainant,
    complainantType:
      primaryComplainant.officerId ||
      primaryComplainant.fullName === "Unknown Officer"
        ? OFFICER
        : CIVILIAN
  };
};
export default generateComplainantLetterAndUploadToS3;
