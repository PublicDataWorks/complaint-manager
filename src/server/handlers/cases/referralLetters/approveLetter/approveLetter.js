import asyncMiddleware from "../../../asyncMiddleware";
import models from "../../../../models";
import { CASE_STATUS } from "../../../../../sharedUtilities/constants";
import generateLetterPdfBuffer from "../sharedReferralLetterUtilities/generateLetterPdfBuffer";
import uploadLetterToS3 from "./uploadLetterToS3";
import Boom from "boom";
import checkFeatureToggleEnabled from "../../../../checkFeatureToggleEnabled";

const approveLetter = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;

  const includeSignature = checkFeatureToggleEnabled(
    request,
    "letterSignatureFeature"
  );

  await models.sequelize.transaction(async transaction => {
    const existingCase = await models.cases.findById(request.params.caseId);
    validateCaseStatus(existingCase);
    await generateLetterAndUploadToS3(
      caseId,
      existingCase.caseNumber,
      includeSignature,
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
  includeSignature,
  transaction
) => {
  const generatedReferralLetterPdf = await generateLetterPdfBuffer(
    caseId,
    includeSignature,
    transaction
  );
  await uploadLetterToS3(caseId, caseNumber, generatedReferralLetterPdf);
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

export default approveLetter;
