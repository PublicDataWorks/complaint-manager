import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import getSortingOrderForQuery from "../helpers/getSortingOrderForQuery";
import {
  ASCENDING,
  DEFAULT_PAGINATION_LIMIT,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";

const Op = sequelize.Op;

export const CASES_TYPE = {
  ARCHIVED: "ARCHIVED",
  WORKING: "WORKING"
};

export const GET_CASES_AUDIT_DETAILS = {
  cases: {
    attributes: [
      "id",
      "complaintType",
      "status",
      "year",
      "caseNumber",
      "firstContactDate",
      "deletedAt",
      "tagNames",
      "assignedTo"
    ]
  },
  accusedOfficers: {
    attributes: ["firstName", "middleName", "lastName", "personType"]
  },
  earliestAddedComplainant: {
    attributes: ["firstName", "middleName", "lastName", "suffix", "personType"]
  }
};

const getCases = async (
  casesType,
  sortBy,
  sortDirection,
  transaction = null,
  page = null
) => {
  const order = [
    ...getSortingOrderForQuery(sortBy, sortDirection),
    ["year", DESCENDING],
    ["caseNumber", DESCENDING]
  ];

  const where =
    casesType === CASES_TYPE.ARCHIVED
      ? {
          deletedAt: { [Op.ne]: null }
        }
      : {
          deletedAt: null
        };
  let limit, offset;
  if (page) {
    offset = (page - 1) * DEFAULT_PAGINATION_LIMIT;
    limit = DEFAULT_PAGINATION_LIMIT;
  }

  const queryOptions = {
    where: where,
    transaction,
    order: order,
    limit: limit,
    offset: offset
  };

  return await models.sortable_cases_view.findAndCountAll(queryOptions);
};

export default getCases;
