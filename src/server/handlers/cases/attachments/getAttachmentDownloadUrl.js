import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";
import { auditFileAction } from "../../audits/auditFileAction";
import { AUDIT_FILE_TYPE } from "../../../../sharedUtilities/constants";

const asyncMiddleware = require("../../asyncMiddleware");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config");
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
    const fileName = request.params.fileName;
    const caseId = request.params.caseId;

    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    const signedUrl = await models.sequelize.transaction(async transaction => {
      const complainantLetter = await models.complainant_letter.findOne(
        {
          where: { finalPdfFilename: fileName }
        },
        { auditUser: request.nickname, transaction }
      );
      const referralLetter = await models.referral_letter.findOne(
        {
          where: { finalPdfFilename: fileName }
        },
        {
          auditUser: request.nickname,
          transaction
        }
      );

      if (complainantLetter) {
        if (newAuditFeatureToggle) {
          await auditFileAction(
            request.nickname,
            caseId,
            AUDIT_ACTION.DOWNLOADED,
            fileName,
            AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
            transaction
          );
        } else {
          await legacyAuditDataAccess(
            request.nickname,
            complainantLetter.caseId,
            AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
            transaction,
            AUDIT_ACTION.DOWNLOADED
          );
        }
        return getComplainantLetterS3Url(s3, complainantLetter);
      }

      if (referralLetter) {
        if (newAuditFeatureToggle) {
          await auditFileAction(
            request.nickname,
            caseId,
            AUDIT_ACTION.DOWNLOADED,
            fileName,
            AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
            transaction
          );
        } else {
          await legacyAuditDataAccess(
            request.nickname,
            referralLetter.caseId,
            AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            transaction,
            AUDIT_ACTION.DOWNLOADED
          );
        }
        return getReferralLetterS3Url(s3, referralLetter);
      }

      if (newAuditFeatureToggle) {
        await auditFileAction(
          request.nickname,
          caseId,
          AUDIT_ACTION.DOWNLOADED,
          fileName,
          AUDIT_FILE_TYPE.ATTACHMENT,
          transaction
        );
      } else {
        await legacyAuditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.ATTACHMENT,
          transaction,
          AUDIT_ACTION.DOWNLOADED,
          { fileName: [fileName] }
        );
      }

      const filenameWithCaseId = `${caseId}/${fileName}`;
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
