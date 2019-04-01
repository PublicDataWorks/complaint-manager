import models from "../../../models";
import sequelize from "sequelize";
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
      "assignedTo"
    ]
  },
  earliestAddedAccusedOfficer: {
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

const caseInsensitiveSort = attributeName => {
  return sequelize.fn(
    "lower",
    sequelize.col(models.sortable_cases_view.rawAttributes[attributeName].field)
  );
};

const getSortingOrderForQuery = (sortBy, sortDirection) => {
  switch (sortBy) {
    case SORT_CASES_BY.PRIMARY_COMPLAINANT:
      if (sortDirection === ASCENDING) {
        return [
          ["complainantPersonType", DESCENDING],
          [
            caseInsensitiveSort("complainantLastName"),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort(
              "complainantFirstName",
              `${ASCENDING} NULLS FIRST`
            )
          ],
          [
            caseInsensitiveSort("complainantMiddleName"),
            `${ASCENDING} NULLS FIRST`
          ]
        ];
      } else {
        return [
          ["complainantPersonType", ASCENDING],
          [
            caseInsensitiveSort("complainantLastName"),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantFirstName"),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantMiddleName"),
            `${DESCENDING} NULLS LAST`
          ]
        ];
      }
    case SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER:
      if (sortDirection === ASCENDING) {
        return [
          ["accusedPersonType", DESCENDING],
          [caseInsensitiveSort("accusedLastName"), `${ASCENDING} NULLS FIRST`],
          [caseInsensitiveSort("accusedFirstName"), `${ASCENDING} NULLS FIRST`],
          [caseInsensitiveSort("accusedMiddleName"), `${ASCENDING} NULLS FIRST`]
        ];
      } else {
        return [
          ["accusedPersonType", ASCENDING],
          [caseInsensitiveSort("accusedLastName"), `${DESCENDING} NULLS LAST`],
          [caseInsensitiveSort("accusedFirstName"), `${DESCENDING} NULLS LAST`],
          [caseInsensitiveSort("accusedMiddleName"), `${DESCENDING} NULLS LAST`]
        ];
      }

    case SORT_CASES_BY.FIRST_CONTACT_DATE:
    case SORT_CASES_BY.STATUS:
    case SORT_CASES_BY.ASSIGNED_TO:
      return [[sortBy, sortDirection]];
    case SORT_CASES_BY.CASE_REFERENCE:
      return [["year", sortDirection], ["caseNumber", sortDirection]];
    default:
      return [["year", DESCENDING], ["caseNumber", DESCENDING]];
  }
};

export default getCases;
