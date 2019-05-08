import transformAuditsForExport from "./transformAuditsForExport";
import models from "../../../../server/models";

const getTransformedAudits = async dateRangeCondition => {
  const audits = await models.audit.findAll({
    where: dateRangeCondition,
    include: [
      {
        model: models.export_audit,
        as: "exportAudit"
      }
    ]
  });

  return transformAuditsForExport(audits);
};

export default getTransformedAudits;
