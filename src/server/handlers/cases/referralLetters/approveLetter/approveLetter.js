import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../policeDataManager/models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  CASE_STATUS,
  COMPLAINANT_LETTER,
  REFERRAL_LETTER,
  REFERRAL_LETTER_VERSION,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { REFERRAL_LETTER_OPTIONS } from "../getReferralLetterPdf/getReferralLetterPdfData";
import uploadLetterToS3 from "../sharedLetterUtilities/uploadLetterToS3";
import Boom from "boom";
import constructFilename from "../constructFilename";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { generateComplainantLetterAndUploadToS3 } from "./generateComplainantLetterAndUploadToS3";
import { auditFileAction } from "../../../audits/auditFileAction";
import generateLetterPdfBuffer from "../generateLetterPdfBuffer";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const approveLetter = asyncMiddleware(async (request, response, next) => {
  validateUserPermissions(request);

  const caseId = request.params.caseId;
  const nickname = request.nickname;
  const existingCase = await getCase(caseId);
  validateCaseStatus(existingCase);

  const filename = constructFilename(
    existingCase,
    REFERRAL_LETTER_VERSION.FINAL
  );

  await models.sequelize.transaction(async transaction => {
    const complainantLetter = await generateComplainantLetterAndUploadToS3(
      existingCase,
      nickname,
      transaction
    );
    await createLetterAttachment(
      existingCase.id,
      complainantLetter.finalPdfFilename,
      COMPLAINANT_LETTER,
      transaction,
      nickname
    );

    await generateReferralLetterAndUploadToS3(caseId, filename, transaction);

    await createLetterAttachment(
      existingCase.id,
      filename,
      REFERRAL_LETTER,
      transaction,
      nickname
    );

    await saveFilename(filename, caseId, nickname, transaction);

    await auditFileAction(
      nickname,
      caseId,
      AUDIT_ACTION.UPLOADED,
      filename,
      AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
      transaction
    );
    await transitionCaseToForwardedToAgency(existingCase, request, transaction);
  });
  response.status(200).send();
});

const createLetterAttachment = async (
  caseId,
  fileName,
  description,
  transaction,
  nickname
) => {
  await models.attachment.create(
    {
      fileName: fileName,
      description: description,
      caseId: caseId
    },
    {
      transaction: transaction,
      auditUser: nickname
    }
  );
};

const validateCaseStatus = existingCase => {
  if (existingCase.status !== CASE_STATUS.READY_FOR_REVIEW) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE);
  }
};

const generateReferralLetterAndUploadToS3 = async (
  caseId,
  filename,
  nickname,
  transaction
) => {
  const includeSignature = true;
  const { pdfBuffer } = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction,
    REFERRAL_LETTER_OPTIONS
  );

  const filenameWithCaseId = `${caseId}/${filename}`;

  await uploadLetterToS3(
    filenameWithCaseId,
    pdfBuffer,
    config[process.env.NODE_ENV].referralLettersBucket
  );
};

const transitionCaseToForwardedToAgency = async (
  existingCase,
  request,
  transaction
) => {
  await existingCase.update(
    { status: CASE_STATUS.FORWARDED_TO_AGENCY },
    { auditUser: request.nickname, transaction }
  );
};

const saveFilename = async (filename, caseId, auditUser, transaction) => {
  const referralLetter = await models.referral_letter.findOne({
    where: { caseId: caseId }
  });
  await referralLetter.update(
    { finalPdfFilename: filename },
    { auditUser: auditUser, transaction }
  );
};

const validateUserPermissions = request => {
  if (
    !request.permissions.includes(USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES)
  ) {
    throw Boom.badRequest(
      BAD_REQUEST_ERRORS.PERMISSIONS_MISSING_TO_APPROVE_LETTER
    );
  }
};

const getCase = async caseId => {
  return await models.cases.findByPk(caseId, {
    include: [
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.civilian,
        as: "complainantCivilians",
        include: [
          models.address,
          { model: models.civilian_title, as: "civilianTitle" }
        ]
      }
    ]
  });
};

export default approveLetter;
