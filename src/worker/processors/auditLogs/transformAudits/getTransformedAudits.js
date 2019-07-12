import transformAuditsForExport from "./transformAuditsForExport";
import models from "../../../../server/models";
import _ from "lodash";

const winston = require("winston");

const getTransformedAudits = async (
  dateRangeCondition = {},
  queryLimit = 1000
) => {
  let transformedAuditsForExport = [];
  let previouslyTransformedAudits = 0;
  const totalAudits = await models.audit.count({
    where: dateRangeCondition
  });
  winston.info(
    `Database returned ${
      totalAudits.length
    } audits that need to be transformed.`
  );

  while (
    previouslyTransformedAudits != totalAudits &&
    previouslyTransformedAudits < totalAudits
  ) {
    let limitedResultSet = await models.audit.findAll({
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
      ],
      offset: previouslyTransformedAudits,
      limit: queryLimit
    });

    previouslyTransformedAudits += limitedResultSet.length;

    transformedAuditsForExport.push(transformAuditsForExport(limitedResultSet));
  }

  return _.flatten(transformedAuditsForExport);
};

export default getTransformedAudits;
