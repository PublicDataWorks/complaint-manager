import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  REFERRAL_LETTER_VERSION,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import generateLetterPdfBuffer from "../sharedReferralLetterUtilities/generateLetterPdfBuffer";
import uploadLetterToS3 from "./uploadLetterToS3";
import Boom from "boom";
import auditUpload from "./auditUpload";
import constructFilename from "../constructFilename";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

const approveLetter = asyncMiddleware(async (request, response, next) => {
  validateUserPermissions(request);

  const caseId = request.params.caseId;
  const existingCase = await getCase(caseId);
  validateCaseStatus(existingCase);

  const filename = constructFilename(
    existingCase,
    REFERRAL_LETTER_VERSION.FINAL
  );

  await models.sequelize.transaction(async transaction => {
    await generateLetterAndUploadToS3(caseId, filename, transaction);

    await saveFilename(filename, caseId, request.nickname, transaction);
    await auditUpload(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER_PDF,
      transaction
    );
    await transitionCaseToForwardedToAgency(existingCase, request, transaction);
  });
  response.status(200).send();
});

const validateCaseStatus = existingCase => {
  if (existingCase.status !== CASE_STATUS.READY_FOR_REVIEW) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS_FOR_UPDATE);
  }
};

const generateLetterAndUploadToS3 = async (caseId, filename, transaction) => {
  const includeSignature = true;
  const generatedReferralLetterPdf = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction
  );

  await uploadLetterToS3(filename, generatedReferralLetterPdf);
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
  const referralLetter = await models.referral_letter.find({
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
  return await models.cases.findById(caseId, {
    include: [
      {
        model: models.case_officer,
        as: "complainantOfficers"
      },
      {
        model: models.civilian,
        as: "complainantCivilians"
      }
    ]
  });
};

export default approveLetter;
