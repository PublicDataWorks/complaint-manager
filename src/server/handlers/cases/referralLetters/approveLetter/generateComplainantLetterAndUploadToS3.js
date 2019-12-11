import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  COMPLAINANT_LETTER,
  PERSON_TYPE
} from "../../../../../sharedUtilities/constants";
import constructFilename from "../constructFilename";
import generateComplainantLetterPdfBuffer from "../complainantLetter/generateComplainantLetterPdfBuffer";
import models from "../../../../complaintManager/models";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import config from "../../../../config/config";
import { auditFileAction } from "../../../audits/auditFileAction";
import { getPersonType } from "../../../../complaintManager/models/modelUtilities/getPersonType";

const generateComplainantLetterAndUploadToS3 = async (
  existingCase,
  nickname,
  transaction
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

  await auditFileAction(
    nickname,
    caseId,
    AUDIT_ACTION.UPLOADED,
    finalPdfFilename,
    AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
    transaction
  );
  return createdComplainantLetter;
};

const getFirstComplainant = existingCase => {
  const primaryComplainant = existingCase.primaryComplainant;
  const complainantType = getPersonType(primaryComplainant);
  return {
    primaryComplainant: primaryComplainant,
    primaryComplainantType: complainantType
  };
};
export default generateComplainantLetterAndUploadToS3;
