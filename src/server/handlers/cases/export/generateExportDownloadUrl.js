const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config");

const {
  AUDIT_TYPE,
  AUDIT_SUBJECT,
  AUDIT_ACTION,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} = require("../../../../sharedUtilities/constants");
const models = require("../../../models/index");

const generateExportDownloadUrl = async (fileName, userName) => {
  const s3 = createConfiguredS3Instance();

  const signedUrl = await models.sequelize.transaction(async transaction => {
    await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: AUDIT_SUBJECT.ALL_CASE_INFORMATION,
        user: userName
      },
      { transaction }
    );

    return s3.getSignedUrl(S3_GET_OBJECT, {
      Bucket: config[process.env.NODE_ENV].exportsBucket,
      Key: `${fileName}`,
      Expires: S3_URL_EXPIRATION
    });
  });
  return signedUrl;
};

module.exports = generateExportDownloadUrl;
