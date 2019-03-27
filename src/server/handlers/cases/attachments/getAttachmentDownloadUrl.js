const asyncMiddleware = require("../../asyncMiddleware");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config");
import auditDataAccess from "../../auditDataAccess";
const {
  AUDIT_SUBJECT,
  AUDIT_ACTION,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} = require("../../../../sharedUtilities/constants");
const models = require("../../../models/index");

const getAttachmentDownloadUrl = asyncMiddleware(
  async (request, response, next) => {
    const s3 = createConfiguredS3Instance();

    const signedUrl = await models.sequelize.transaction(async transaction => {
      const complainantLetter = await models.complainant_letter.findOne(
        {
          where: { finalPdfFilename: request.params.fileName }
        },
        { auditUser: request.nickname, transaction }
      );
      const referralLetter = await models.referral_letter.findOne(
        {
          where: { finalPdfFilename: request.params.fileName }
        },
        {
          auditUser: request.nickname,
          transaction
        }
      );

      if (complainantLetter) {
        await auditDataAccess(
          request.nickname,
          complainantLetter.caseId,
          AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
          transaction,
          AUDIT_ACTION.DOWNLOADED
        );
        return getComplainantLetterS3Url(s3, complainantLetter);
      }
      if (referralLetter) {
        await auditDataAccess(
          request.nickname,
          referralLetter.caseId,
          AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
          transaction,
          AUDIT_ACTION.DOWNLOADED
        );
        return getReferralLetterS3Url(s3, referralLetter);
      }
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.ATTACHMENT,
        transaction,
        AUDIT_ACTION.DOWNLOADED,
        { fileName: [request.params.fileName] }
      );
      const filenameWithCaseId = `${request.params.caseId}/${
        request.params.fileName
      }`;
      return getS3SignedUrl(
        s3,
        config[process.env.NODE_ENV].s3Bucket,
        filenameWithCaseId
      );
    });

    response.setHeader("Content-Type", "text/html");
    response.write(signedUrl);
    response.end();
  }
);

const getS3SignedUrl = (s3, bucket, key) => {
  return s3.getSignedUrl(S3_GET_OBJECT, {
    Bucket: bucket,
    Key: key,
    Expires: S3_URL_EXPIRATION
  });
};

const getComplainantLetterS3Url = (s3, complainantLetter) => {
  const filenameWithCaseId = `${complainantLetter.caseId}/${
    complainantLetter.finalPdfFilename
  }`;

  return getS3SignedUrl(
    s3,
    config[process.env.NODE_ENV].complainantLettersBucket,
    filenameWithCaseId
  );
};

const getReferralLetterS3Url = (s3, referralLetter) => {
  const filenameWithCaseId = `${referralLetter.caseId}/${
    referralLetter.finalPdfFilename
  }`;

  return getS3SignedUrl(
    s3,
    config[process.env.NODE_ENV].referralLettersBucket,
    filenameWithCaseId
  );
};

module.exports = getAttachmentDownloadUrl;
