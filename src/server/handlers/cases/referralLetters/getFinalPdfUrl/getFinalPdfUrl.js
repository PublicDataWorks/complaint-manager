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
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";

const getFinalPdfUrl = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const existingCase = await models.cases.findByPk(caseId, {
    include: [
      {
        model: models.case_officer,
        as: "complainantOfficers",
        auditUser: "test"
      },
      {
        model: models.civilian,
        as: "complainantCivilians",
        auditUser: "test"
      }
    ],
    paranoid: false
  });

  validateCaseStatus(existingCase.status);

  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      caseId,
      AUDIT_SUBJECT.REFERRAL_LETTER,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED
    );
    const signedUrl = await getSignedS3Url(existingCase);
    response.send(signedUrl);
  });
});

const getSignedS3Url = async existingCase => {
  const s3 = createConfiguredS3Instance();
  const referralLetter = await models.referral_letter.findOne({
    where: { caseId: existingCase.id }
  });

  return s3.getSignedUrl(S3_GET_OBJECT, {
    Bucket: config[process.env.NODE_ENV].referralLettersBucket,
    Key: referralLetter.finalPdfFilename,
    Expires: S3_URL_EXPIRATION
  });
};

const validateCaseStatus = caseStatus => {
  if (
    caseStatus !== CASE_STATUS.FORWARDED_TO_AGENCY &&
    caseStatus !== CASE_STATUS.CLOSED
  ) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS);
  }
};

export default getFinalPdfUrl;
