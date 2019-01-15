const asyncMiddleware = require("../../asyncMiddleware");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config");
const auditDataAccess = require("../../auditDataAccess");
const {
  AUDIT_SUBJECT,
  AUDIT_ACTION,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} = require("../../../../sharedUtilities/constants");
const models = require("../../../models/index");

const generateAttachmentDownloadUrl = asyncMiddleware(
  async (request, response, next) => {
    const s3 = createConfiguredS3Instance();

    const signedUrl = await models.sequelize.transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.ATTACHMENTS,
        transaction,
        AUDIT_ACTION.DOWNLOADED,
        { fileName: request.params.fileName }
      );

      return s3.getSignedUrl(S3_GET_OBJECT, {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `${request.params.caseId}/${request.params.fileName}`,
        Expires: S3_URL_EXPIRATION
      });
    });

    response.setHeader("Content-Type", "text/html");
    response.write(signedUrl);
    response.end();
  }
);

module.exports = generateAttachmentDownloadUrl;
