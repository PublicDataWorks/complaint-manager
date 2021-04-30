import models from "../../../policeDataManager/models";
import sequelize from "sequelize";
import {
  ASCENDING,
  DEFAULT_PAGINATION_LIMIT,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import { caseInsensitiveSort } from "../../sequelizeHelpers";

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

const getSortingOrderForQuery = (sortBy, sortDirection) => {
  const model = models.sortable_cases_view;
  switch (sortBy) {
    case SORT_CASES_BY.PRIMARY_COMPLAINANT:
      if (sortDirection === ASCENDING) {
        return [
          ["complainantPersonType", DESCENDING],
          [
            caseInsensitiveSort("complainantLastName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("complainantFirstName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("complainantMiddleName", model),
            `${ASCENDING} NULLS FIRST`
          ]
        ];
      } else {
        return [
          ["complainantPersonType", ASCENDING],
          [
            caseInsensitiveSort("complainantLastName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantFirstName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("complainantMiddleName", model),
            `${DESCENDING} NULLS LAST`
          ]
        ];
      }
    case SORT_CASES_BY.PRIMARY_ACCUSED_OFFICER:
      if (sortDirection === ASCENDING) {
        return [
          ["accusedPersonType", DESCENDING],
          [
            caseInsensitiveSort("accusedLastName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("accusedFirstName", model),
            `${ASCENDING} NULLS FIRST`
          ],
          [
            caseInsensitiveSort("accusedMiddleName", model),
            `${ASCENDING} NULLS FIRST`
          ]
        ];
      } else {
        return [
          ["accusedPersonType", ASCENDING],
          [
            caseInsensitiveSort("accusedLastName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("accusedFirstName", model),
            `${DESCENDING} NULLS LAST`
          ],
          [
            caseInsensitiveSort("accusedMiddleName", model),
            `${DESCENDING} NULLS LAST`
          ]
        ];
      }

    case SORT_CASES_BY.FIRST_CONTACT_DATE:
    case SORT_CASES_BY.STATUS:
    case SORT_CASES_BY.TAGS:
    case SORT_CASES_BY.ASSIGNED_TO:
      return [[sortBy, sortDirection]];
    case SORT_CASES_BY.CASE_REFERENCE:
      return [
        ["year", sortDirection],
        ["caseNumber", sortDirection]
      ];
    default:
      return [
        ["year", DESCENDING],
        ["caseNumber", DESCENDING]
      ];
  }
};

export default getCases;
