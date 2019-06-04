import transformAuditsForExport from "./transformAuditsForExport";
import models from "../../../../server/models";

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
      }
    ]
  });

  return transformAuditsForExport(audits);
};

export default getTransformedAudits;
