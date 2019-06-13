import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT,
  COMPLAINANT_LETTER,
  PERSON_TYPE
} from "../../../../../sharedUtilities/constants";
import constructFilename from "../constructFilename";
import generateComplainantLetterPdfBuffer from "../complainantLetter/generateComplainantLetterPdfBuffer";
import models from "../../../../models";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import auditUpload from "../sharedLetterUtilities/auditUpload";
import config from "../../../../config/config";
import { auditFileAction } from "../../../audits/auditFileAction";

const generateComplainantLetterAndUploadToS3 = async (
  existingCase,
  nickname,
  transaction,
  newAuditFeatureToggle
) => {
  const caseId = existingCase.id;

  const { primaryComplainant, primaryComplainantType } = getFirstComplainant(
    existingCase
  );

  const finalPdfFilename = constructFilename(existingCase, COMPLAINANT_LETTER);
  let createdComplainantLetter = await models.complainant_letter.create(
    {
      caseId: caseId,
      finalPdfFilename: finalPdfFilename,
      complainantCivilianId:
        primaryComplainantType === PERSON_TYPE.CIVILIAN
          ? primaryComplainant.id
          : null,
      complainantOfficerId:
        primaryComplainantType === PERSON_TYPE.KNOWN_OFFICER
          ? primaryComplainant.id
          : null
    },
    { auditUser: nickname, transaction }
  );

  const pdfBuffer = await generateComplainantLetterPdfBuffer(
    existingCase,
    primaryComplainant
  );

  const fullFilenameWithKey = `${existingCase.id}/${finalPdfFilename}`;
  uploadLetterToS3(
    fullFilenameWithKey,
    pdfBuffer,
    config[process.env.NODE_ENV].complainantLettersBucket
  );
  if (newAuditFeatureToggle) {
    await auditFileAction(
      nickname,
      caseId,
      AUDIT_ACTION.UPLOADED,
      finalPdfFilename,
      AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
      transaction
    );
  } else {
    await auditUpload(
      nickname,
      caseId,
      AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
      { fileName: [finalPdfFilename] },
      transaction
    );
  }
  return createdComplainantLetter;
};

const getFirstComplainant = existingCase => {
  const primaryComplainant = existingCase.primaryComplainant;
  let complainantType;
  if (primaryComplainant.officerId) {
    complainantType = PERSON_TYPE.KNOWN_OFFICER;
  } else if (primaryComplainant.fullName === "Unknown Officer") {
    complainantType = PERSON_TYPE.UNKNOWN_OFFICER;
  } else {
    complainantType = PERSON_TYPE.CIVILIAN;
  }
  return {
    primaryComplainant: primaryComplainant,
    primaryComplainantType: complainantType
  };
};
export default generateComplainantLetterAndUploadToS3;
