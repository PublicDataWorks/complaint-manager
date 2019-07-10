import transformAuditsForExport from "./transformAuditsForExport";
import models from "../../../../server/models";

const winston = require("winston");

const getTransformedAudits = async dateRangeCondition => {
  const audits = await models.audit.findAll({
    where: dateRangeCondition,
    include: [
      {
        model: models.export_audit,
        as: "exportAudit"
      },
      {
        model: models.data_access_audit,
        as: "dataAccessAudit",
        include: [
          {
            model: models.data_access_value,
            as: "dataAccessValues"
          }
        ]
      },
      {
        model: models.file_audit,
        as: "fileAudit"
      },
      {
        model: models.data_change_audit,
        as: "dataChangeAudit"
      },
      {
        model: models.legacy_data_access_audit,
        as: "legacyDataAccessAudit"
      }
    ]
  });
  winston.info(
    `Database returned ${audits.length} audits that need to be transformed.`
  );

  return transformAuditsForExport(audits);
};

export default getTransformedAudits;
