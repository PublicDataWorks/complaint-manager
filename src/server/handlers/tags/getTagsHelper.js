import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import models from "../../policeDataManager/models";
import { caseInsensitiveSort } from "../sequelizeHelpers";
import sequelize from "sequelize";
import { ASCENDING, DESCENDING } from "../../../sharedUtilities/constants";

export const getTagsAndAuditDetails = async transaction => {
  const queryOptions = {
    order: [[caseInsensitiveSort("name", models.tag), ASCENDING]],
    transaction
  };
  const tagObjects = await models.tag.findAll(queryOptions);
  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.tag.name
  );

  const tags = tagObjects.map(tag => ({ name: tag.name, id: tag.id }));

  return { tags: tags, auditDetails: auditDetails };
};

export const getTagsWithCountAndAuditDetails = async transaction => {
  const queryOptions = {
    attributes: [
      "tag.name",
      "tag.id",
      [sequelize.fn("COUNT", sequelize.col("case_tag.case_id")), "count"]
    ],
    include: [
      {
        model: models.tag,
        as: "tag",
        attributes: []
      },
      {
        model: models.cases,
        attributes: []
      }
    ],
    raw: true,
    group: ["tag.name", "tag.id"],
    order: [
      ["count", DESCENDING],
      sequelize.fn("upper", sequelize.col("tag.name"))
    ]
  };
  const tagObjects = await models.case_tag.findAll(queryOptions);
  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.tag.name
  );

  const tags = tagObjects.map(tag => ({
    name: tag.name,
    id: tag.id,
    count: tag.count
  }));

  return { tags: tags, auditDetails: auditDetails };
};
