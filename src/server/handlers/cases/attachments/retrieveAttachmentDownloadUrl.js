import { auditFileAction } from "../../audits/auditFileAction";
import { AUDIT_FILE_TYPE } from "../../../../sharedUtilities/constants";
import createConfiguredS3Instance from "../../../createConfiguredS3Instance";

const asyncMiddleware = require("../../asyncMiddleware");
const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`);
const {
  AUDIT_ACTION,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} = require("../../../../sharedUtilities/constants");
const models = require("../../../policeDataManager/models/index");

const retrieveAttachmentDownloadUrl = asyncMiddleware(
  async (request, response, next) => {
    const s3 = createConfiguredS3Instance();
    const fileName = request.query.fileName;
    const caseId = request.params.caseId;

    const signedUrl = await getSignedUrlForAttachment(
      fileName,
      caseId,
      s3,
      request.nickname
    );

    response.setHeader("Content-Type", "text/html");
    response.write(signedUrl);
    response.end();
  }
);

const getSignedUrlForAttachment = async (fileName, caseId, s3, user) => {
  return await models.sequelize.transaction(async transaction => {
    const complainantLetter = await models.complainant_letter.findOne({
      where: { finalPdfFilename: fileName }
    });
    const referralLetter = await models.referral_letter.findOne({
      where: { finalPdfFilename: fileName }
    });

    if (complainantLetter) {
      await auditFileAction(
        user,
        caseId,
        AUDIT_ACTION.DOWNLOADED,
        fileName,
        AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
        transaction
      );
      return await getComplainantLetterS3Url(s3, complainantLetter);
    } else if (referralLetter) {
      await auditFileAction(
        user,
        caseId,
        AUDIT_ACTION.DOWNLOADED,
        fileName,
        AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
        transaction
      );
      return await getReferralLetterS3Url(s3, referralLetter);
    } else {
      await auditFileAction(
        user,
        caseId,
        AUDIT_ACTION.DOWNLOADED,
        fileName,
        AUDIT_FILE_TYPE.ATTACHMENT,
        transaction
      );

      const filenameWithCaseId = `${caseId}/${fileName}`;
      const rawSignedUrl = await getS3SignedUrl(
        s3,
        config[process.env.NODE_ENV].s3Bucket,
        filenameWithCaseId
      );

      return rawSignedUrl;
    }
  });
};

const getS3SignedUrl = async (s3, bucket, key) => {
  const rawSignedUrl = await s3.getSignedUrl(S3_GET_OBJECT, {
    Bucket: bucket,
    Key: key,
    Expires: S3_URL_EXPIRATION
  });
  if (process.env.REACT_APP_USE_CLOUD_SERVICES == "false") {
    return rawSignedUrl.replace("host.docker.internal", "localhost");
  }
  return rawSignedUrl;
};

const getComplainantLetterS3Url = async (s3, complainantLetter) => {
  const filenameWithCaseId = `${complainantLetter.caseId}/${complainantLetter.finalPdfFilename}`;

  return await getS3SignedUrl(
    s3,
    config[process.env.NODE_ENV].complainantLettersBucket,
    filenameWithCaseId
  );
};

const getReferralLetterS3Url = async (s3, referralLetter) => {
  const filenameWithCaseId = `${referralLetter.caseId}/${referralLetter.finalPdfFilename}`;

  return await getS3SignedUrl(
    s3,
    config[process.env.NODE_ENV].referralLettersBucket,
    filenameWithCaseId
  );
};

module.exports = retrieveAttachmentDownloadUrl;
