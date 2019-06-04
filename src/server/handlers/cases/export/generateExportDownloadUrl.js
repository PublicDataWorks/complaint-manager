import formatDate from "../../../../client/utilities/formatDate";
import _ from "lodash";
import { JOB_OPERATION } from "../../../../sharedUtilities/constants";

const createConfiguredS3Instance = require("../../../createConfiguredS3Instance");
const config = require("../../../config/config")[process.env.NODE_ENV];

const {
  AUDIT_TYPE,
  AUDIT_ACTION,
  S3_GET_OBJECT,
  S3_URL_EXPIRATION
} = require("../../../../sharedUtilities/constants");
const models = require("../../../models/index");

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
  dateRange,
  newAuditFeatureToggle
) => {
  const s3 = createConfiguredS3Instance();

  const signedUrl = await models.sequelize.transaction(async transaction => {
    const auditDetails = getAuditDetailsForExport(dateRange);

    if (newAuditFeatureToggle) {
      const rangeType = dateRange && dateRange.type ? dateRange.type : null;
      const rangeStart =
        dateRange && dateRange.exportStartDate
          ? dateRange.exportStartDate
          : null;
      const rangeEnd =
        dateRange && dateRange.exportEndDate ? dateRange.exportEndDate : null;

      const auditValues = {
        auditAction: AUDIT_ACTION.EXPORTED,
        user: userName,
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
    } else {
      const auditSubject = jobName ? JOB_OPERATION[jobName].auditSubject : null;
      await models.action_audit.create(
        {
          auditType: AUDIT_TYPE.EXPORT,
          action: AUDIT_ACTION.EXPORTED,
          subject: auditSubject,
          user: userName,
          auditDetails: auditDetails
        },
        { transaction }
      );
    }

    return s3.getSignedUrl(S3_GET_OBJECT, {
      Bucket: config.exportsBucket,
      Key: `${fileName}`,
      Expires: S3_URL_EXPIRATION
    });
  });
  return signedUrl;
};

export default generateExportDownloadUrl;
