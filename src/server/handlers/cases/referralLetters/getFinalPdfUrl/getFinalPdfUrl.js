import asyncMiddleware from "../../../asyncMiddleware";
import auditDataAccess from "../../../auditDataAccess";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  CASE_STATUS,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} from "../../../../../sharedUtilities/constants";
import models from "../../../../models";
import config from "../../../../config/config";
import createConfiguredS3Instance from "../../../../createConfiguredS3Instance";
import Boom from "boom";

const getFinalPdfUrl = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.id;
  const existingCase = await models.cases.findById(caseId);

  validateCaseStatus(existingCase.status);

  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );
    const signedUrl = getSignedS3Url(existingCase);
    response.send(signedUrl);
  });
});

const getSignedS3Url = existingCase => {
  const s3 = createConfiguredS3Instance();
  return s3.getSignedUrl(S3_GET_OBJECT, {
    Bucket: config[process.env.NODE_ENV].referralLettersBucket,
    Key: `${existingCase.id}/ReferralLetter_${existingCase.caseNumber}`,
    Expires: S3_URL_EXPIRATION
  });
};

const validateCaseStatus = caseStatus => {
  if (
    caseStatus !== CASE_STATUS.FORWARDED_TO_AGENCY &&
    caseStatus !== CASE_STATUS.CLOSED
  ) {
    throw Boom.badRequest("Invalid case status");
  }
};

export default getFinalPdfUrl;
