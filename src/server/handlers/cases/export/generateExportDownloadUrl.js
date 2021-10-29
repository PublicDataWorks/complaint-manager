import formatDate from "../../../../sharedUtilities/formatDate";
import _ from "lodash";

const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config =
  require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/serverConfig`)[
    process.env.NODE_ENV
  ];

const {
  AUDIT_TYPE,
  AUDIT_ACTION,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} = require("../../../../sharedUtilities/constants");
const models = require("../../../policeDataManager/models/index");

export const getAuditDetailsForExport = dateRange => {
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
  jobName,
  dateRange
) => {
  const s3 = createConfiguredS3Instance();

  const signedUrl = await models.sequelize.transaction(async transaction => {
    const auditDetails = getAuditDetailsForExport(dateRange);

    const rangeType = dateRange && dateRange.type ? dateRange.type : null;
    const rangeStart =
      dateRange && dateRange.exportStartDate ? dateRange.exportStartDate : null;
    const rangeEnd =
      dateRange && dateRange.exportEndDate ? dateRange.exportEndDate : null;

    const auditValues = {
      auditAction: AUDIT_ACTION.EXPORTED,
      user: userName,
      managerType: "complaint",
      exportAudit: {
        exportType: jobName,
        rangeType: rangeType,
        rangeStart: rangeStart,
        rangeEnd: rangeEnd
      }
    };

    await models.audit.create(auditValues, {
      include: [
        {
          as: "exportAudit",
          model: models.export_audit
        }
      ],
      transaction
    });

    return s3.getSignedUrl(S3_GET_OBJECT, {
      Bucket: config.exportsBucket,
      Key: `${fileName}`,
      Expires: S3_URL_EXPIRATION
    });
  });

  if (process.env.USE_CLOUD_SERVICES == "false") {
    return signedUrl.replace("host.docker.internal", "localhost");
  }

  return signedUrl;
};

export default generateExportDownloadUrl;
