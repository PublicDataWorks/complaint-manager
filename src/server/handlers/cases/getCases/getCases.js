import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import getSortingOrderForQuery from "../helpers/getSortingOrderForQuery";
import {
  ASCENDING,
  DEFAULT_PAGINATION_LIMIT,
  DESCENDING,
  USER_PERMISSIONS
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
  page = null,
  permissions
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
    where,
    transaction,
    order,
    limit,
    offset
  };

  const sortableCases = await models.sortable_cases_view.findAndCountAll(
    queryOptions
  );

  sortableCases.rows.forEach(c => {
    if (c.dataValues.complainantIsAnonymous) {
      if (c.dataValues.firstName !== "") {
        c.dataValues.complainantFirstName = "Anonymous";
      }
      c.dataValues.complainantLastName = "";
      c.dataValues.complainantMiddleName = "";
      c.dataValues.complainantSuffix = "";
      console.log(c.dataValues);
    }
  });
  return sortableCases;
};

export default getCases;
