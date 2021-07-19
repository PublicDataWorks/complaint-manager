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

export const getTagsWithCountAndAuditDetails = async (
  sortBy,
  sortDirection
) => {
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
    order: determineOrderForQueryWithCount(sortBy, sortDirection)
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

const determineOrderForQueryWithCount = (sortBy, sortDirection) => {
  let sort = [
    ["count", DESCENDING],
    [sequelize.fn("upper", sequelize.col("tag.name")), ASCENDING]
  ];

  if (sortBy === "count") {
    if (sortDirection === ASCENDING) {
      // if it's default or descending, leave the param as is
      sort[0][1] = ASCENDING;
    }
  } else if (sortBy === "name") {
    let nameParam = sort[1];
    sort[1] = sort[0];
    if (sortDirection === DESCENDING) {
      nameParam[1] = DESCENDING;
    }
    sort[0] = nameParam;
  }

  return sort;
};
