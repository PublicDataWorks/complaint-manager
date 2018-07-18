const asyncMiddleware = require("../../asyncMiddleware");
const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config");
const auditDataAccess = require("../../auditDataAccess");
const {
  AUDIT_SUBJECT,
  DOWNLOADED
} = require("../../../../sharedUtilities/constants");
const models = require("../../../models/index");

const downloadAttachment = asyncMiddleware(async (request, response, next) => {
  const s3 = createConfiguredS3Instance();
  response.attachment(request.params.fileName);

  await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      request.nickname,
      request.params.id,
      AUDIT_SUBJECT.ATTACHMENTS,
      transaction,
      DOWNLOADED,
      { fileName: request.params.fileName }
    );

    s3
      .getObject({
        Bucket: config[process.env.NODE_ENV].s3Bucket,
        Key: `${request.params.id}/${request.params.fileName}`
      })
      .createReadStream()
      .pipe(response);
  });
});

module.exports = downloadAttachment;
