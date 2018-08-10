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

    await models.sequelize.transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        request.params.id,
        AUDIT_SUBJECT.ATTACHMENTS,
        transaction,
        AUDIT_ACTION.DOWNLOADED,
        { fileName: request.params.fileName }
      );

      const singedUrl = s3.getSignedUrl(S3_GET_OBJECT, {
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `${request.params.id}/${request.params.fileName}`,
        Expires: S3_URL_EXPIRATION
      });

      response.status(200).send(singedUrl);
      if (next) next();
    });
  }
);

module.exports = generateAttachmentDownloadUrl;
