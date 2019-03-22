import models from "../../../models";
import sequelize from "sequelize";
import { addToExistingAuditDetails } from "../../getQueryAuditAccessDetails";
import {
  ASCENDING,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
const Op = sequelize.Op;

export const CASES_TYPE = {
  ARCHIVED: "ARCHIVED",
  WORKING: "WORKING"
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

const getCases = async (
  casesType,
  sortBy,
  sortDirection,
  transaction = null,
  auditDetails = null
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

  const queryOptions = {
    where: where,
    transaction,
    order: order
  };

  const sortedCases = await models.sortable_cases_view.findAll(queryOptions);

  addAuditDetailsForSortedCases(auditDetails);

  return sortedCases;
};

const addAuditDetailsForSortedCases = existingAuditDetails => {
  const queryOptionsForAudit = {
    attributes: [
      "id",
      "complaintType",
      "caseNumber",
      "year",
      "status",
      "firstContactDate",
      "assignedTo"
    ],
    include: [
      {
        model: models.civilian,
        as: "complainantCivilians"
      },
      {
        model: models.case_officer,
        as: "accusedOfficers"
      },
      {
        model: models.case_officer,
        as: "complainantOfficers"
      }
    ]
  };

  addToExistingAuditDetails(
    existingAuditDetails,
    queryOptionsForAudit,
    models.cases.name
  );
};
export default getCases;
