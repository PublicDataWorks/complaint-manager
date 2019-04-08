import formatDate from "../../../../client/utilities/formatDate";
import _ from "lodash";

const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config")[process.env.NODE_ENV];

const {
  AUDIT_TYPE,
  AUDIT_SUBJECT,
  AUDIT_ACTION,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} = require("../../../../sharedUtilities/constants");
const models = require("../../../models/index");

const getAuditDetailsForExport = dateRange => {
  const auditDetails = {};

  if (!dateRange) {
    return null;
  }

  auditDetails["Export Range"] = [
    `${formatDate(dateRange.exportStartDate)} to ${formatDate(
      dateRange.exportEndDate
    )}`
  ];

  if (dateRange.type) {
    auditDetails["Date Type"] = [_.startCase(dateRange.type)];
  }
  return auditDetails;
};

const generateExportDownloadUrl = async (
  fileName,
  userName,
  auditSubject,
  dateRange
) => {
  const s3 = createConfiguredS3Instance();

  const signedUrl = await models.sequelize.transaction(async transaction => {
    const auditDetails = getAuditDetailsForExport(dateRange);

    const audit = await models.action_audit.create(
      {
        auditType: AUDIT_TYPE.EXPORT,
        action: AUDIT_ACTION.EXPORTED,
        subject: auditSubject,
        user: userName,
        auditDetails: auditDetails
      },
      { transaction }
    );

    return s3.getSignedUrl(S3_GET_OBJECT, {
      Bucket: config.exportsBucket,
      Key: `${fileName}`,
      Expires: S3_URL_EXPIRATION
    });
  });
  return signedUrl;
};

module.exports = generateExportDownloadUrl;
