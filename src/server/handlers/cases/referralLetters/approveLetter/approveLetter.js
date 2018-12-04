import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  CIVILIAN_INITIATED,
  USER_PERMISSIONS
} from "../../../../../sharedUtilities/constants";
import generateLetterPdfBuffer from "../sharedReferralLetterUtilities/generateLetterPdfBuffer";
import uploadLetterToS3 from "./uploadLetterToS3";
import Boom from "boom";
import checkFeatureToggleEnabled from "../../../../checkFeatureToggleEnabled";
import auditUpload from "./auditUpload";
import constructFilename from "../constructFilename";

const approveLetter = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;

  if (
    !request.permissions.includes(USER_PERMISSIONS.UPDATE_ALL_CASE_STATUSES)
  ) {
    throw Boom.badRequest("Missing permissions to approve letter");
  }

  const includeSignature = checkFeatureToggleEnabled(
    request,
    "letterSignatureFeature"
  );

  await models.sequelize.transaction(async transaction => {
    const existingCase = await models.cases.findById(request.params.caseId, {
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

    validateCaseStatus(existingCase);
    const firstComplainant =
      existingCase.complaintType === CIVILIAN_INITIATED
        ? existingCase.complainantCivilians[0]
        : existingCase.complainantOfficers[0];

    const complainantLastName = firstComplainant
      ? firstComplainant.lastName
      : "";

    await generateLetterAndUploadToS3(
      caseId,
      existingCase.caseNumber,
      existingCase.firstContactDate,
      complainantLastName,
      includeSignature,
      transaction
    );
    const filename = constructFilename(
      caseId,
      existingCase.caseNumber,
      existingCase.firstContactDate,
      complainantLastName
    );
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
    throw Boom.badRequest("Invalid case status");
  }
};

const generateLetterAndUploadToS3 = async (
  caseId,
  caseNumber,
  firstContactDate,
  firstComplainantLastName,
  includeSignature,
  transaction
) => {
  const generatedReferralLetterPdf = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction
  );

  await uploadLetterToS3(
    caseId,
    caseNumber,
    firstContactDate,
    firstComplainantLastName,
    generatedReferralLetterPdf
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
  const referralLetter = await models.referral_letter.find({
    where: { caseId: caseId }
  });
  await referralLetter.update(
    { finalPdfFilename: filename },
    { auditUser: auditUser, transaction }
  );
};

export default approveLetter;
