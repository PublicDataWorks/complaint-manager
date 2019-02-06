import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import {
  CIVILIAN_INITIATED,
  COMPLAINANT_LETTER,
  AUDIT_SUBJECT
} from "../../../../../sharedUtilities/constants";
import { firstCreated } from "../constructFilename";
import constructFilename from "../constructFilename";
import { generateComplainantLetterPdfBuffer } from "../sharedReferralLetterUtilities/generatePdfBuffer";
import models from "../../../../models";
import uploadLetterToS3 from "./uploadLetterToS3";
import auditUpload from "./auditUpload";
import config from "../../../../config/config";

const CIVILIAN = "CIVILIAN";
const OFFICER = "OFFICER";

const generateComplainantLetterAndUploadToS3 = async (
  existingCase,
  nickname,
  transaction
) => {
  const caseId = existingCase.id;

  const s3 = createConfiguredS3Instance();

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
  return existingCase.complaintType === CIVILIAN_INITIATED
    ? {
        complainant: firstCreated(existingCase.complainantCivilians),
        complainantType: CIVILIAN
      }
    : {
        complainant: firstCreated(existingCase.complainantOfficers),
        complainantType: OFFICER
      };
};

export default generateComplainantLetterAndUploadToS3;
