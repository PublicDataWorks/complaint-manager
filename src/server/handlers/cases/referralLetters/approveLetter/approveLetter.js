import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  COMPLAINANT_LETTER,
  REFERRAL_LETTER_VERSION,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import { generateReferralLetterPdfBuffer } from "../sharedReferralLetterUtilities/generatePdfBuffer";
import uploadLetterToS3 from "./uploadLetterToS3";
import Boom from "boom";
import auditUpload from "./auditUpload";
import constructFilename from "../constructFilename";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import generateComplainantLetterAndUploadToS3 from "./generateComplainantLetterAndUploadToS3";
import auditDataAccess from "../../../auditDataAccess";
import config from "../../../../config/config";

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
    await createComplainantLetterAttachment(
      existingCase.id,
      complainantLetter.finalPdfFilename,
      transaction,
      nickname
    );
    await auditDataAccess(
      nickname,
      caseId,
      AUDIT_SUBJECT.CASE_DETAILS,
      transaction
    );
    await generateLetterAndUploadToS3(caseId, filename, transaction);

    await saveFilename(filename, caseId, nickname, transaction);
    await auditUpload(
      nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER_PDF,
      transaction
    );
    await transitionCaseToForwardedToAgency(existingCase, request, transaction);
  });
  response.status(200).send();
});

const createComplainantLetterAttachment = async (
  caseId,
  fileName,
  transaction,
  nickname
) => {
  await models.attachment.create(
    {
      fileName: fileName,
      description: COMPLAINANT_LETTER,
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

const generateLetterAndUploadToS3 = async (
  caseId,
  filename,
  nickname,
  transaction
) => {
  const includeSignature = true;
  const generatedReferralLetterPdf = await generateReferralLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction
  );

  await uploadLetterToS3(
    filename,
    generatedReferralLetterPdf,
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
        include: [models.address]
      }
    ]
  });
};

export default approveLetter;
