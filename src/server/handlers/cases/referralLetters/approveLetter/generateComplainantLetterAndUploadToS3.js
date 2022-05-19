import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  COMPLAINANT_LETTER
} from "../../../../../sharedUtilities/constants";
import constructFilename from "../constructFilename";
import getComplainantLetterPdfData from "../complainantLetter/getComplainantLetterPdfData";
import models from "../../../../policeDataManager/models";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import { auditFileAction } from "../../../audits/auditFileAction";
import { getPersonType } from "../../../../policeDataManager/models/modelUtilities/getPersonType";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";
import { retrieveSignatureImage } from "../retrieveSignatureImage";
const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);

export const generateComplainantLetterAndUploadToS3 = async (
  existingCase,
  nickname,
  transaction
) => {
  const caseId = existingCase.id;

  const { primaryComplainant, primaryComplainantType } =
    getPrimaryComplainantTuple(existingCase);

  const finalPdfFilename = constructFilename(existingCase, COMPLAINANT_LETTER);
  let createdComplainantLetter = await models.complainant_letter.create(
    {
      caseId: caseId,
      finalPdfFilename: finalPdfFilename,
      complainantCivilianId:
        primaryComplainantType === PERSON_TYPE.CIVILIAN.description
          ? primaryComplainant.id
          : null,
      complainantOfficerId:
        primaryComplainantType === PERSON_TYPE.KNOWN_OFFICER.description
          ? primaryComplainant.id
          : null
    },
    { auditUser: nickname, transaction }
  );

  const pdfBuffer = await models.sequelize.transaction(async transaction => {
    let result = await generateLetterPdfBuffer(
      existingCase.id,
      true,
      transaction,
      {
        hasEditPage: false,
        getSignature: async ({ sender }) => {
          return await retrieveSignatureImage(
            sender ? sender.signatureFile : undefined
          );
        },
        getData: async args => {
          return {
            data: await getComplainantLetterPdfData(args),
            auditDetails: {}
          };
        },
        templateFile: "complainantLetterPdf.tpl"
      },
      { caseId: existingCase.id, complainant: primaryComplainant }
    );
    return result.pdfBuffer;
  });

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

export const getPrimaryComplainantTuple = existingCase => {
  const primaryComplainant = existingCase.primaryComplainant;
  const complainantType = getPersonType(primaryComplainant);
  return {
    primaryComplainant: primaryComplainant,
    primaryComplainantType: complainantType
  };
};
