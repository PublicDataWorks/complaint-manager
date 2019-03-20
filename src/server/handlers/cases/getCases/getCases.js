import models from "../../../models";
import Sequelize from "sequelize";
import { addToExistingAuditDetails } from "../../getQueryAuditAccessDetails";
import {
  ASCENDING,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";

const Op = Sequelize.Op;

export const CASES_TYPE = {
  ARCHIVED: "ARCHIVED",
  WORKING: "WORKING"
};

const getSortingOrderForQuery = (sortBy, sortDirection) => {
  switch (sortBy) {
    case SORT_CASES_BY.COMPLAINANT:
      if (sortDirection === ASCENDING) {
        return [
          ["complainantType", DESCENDING],
          ["complainantLastName", `${ASCENDING} NULLS FIRST`]
        ];
      } else {
        return [
          ["complainantType", ASCENDING],
          ["complainantLastName", `${DESCENDING} NULLS LAST`]
        ];
      }
    case SORT_CASES_BY.ACCUSED_OFFICER:
      return [
        ["accusedOfficerExists", sortDirection],
        ["accusedOfficerKnown", sortDirection],
        ["accusedLastName", sortDirection]
      ];
    case SORT_CASES_BY.FIRST_CONTACT_DATE:
    case SORT_CASES_BY.STATUS:
    case SORT_CASES_BY.ASSIGNED_TO:
      return [[sortBy, sortDirection]];
    case SORT_CASES_BY.CASE_REFERENCE:
      return [["year", sortDirection], ["caseNumber", sortDirection]];
    default:
      return [["year", ASCENDING], ["caseNumber", ASCENDING]];
  }
};

const getCases = async (
  casesType,
  sortBy,
  sortDirection,
  transaction = null,
  auditDetails = null
) => {
  const order = getSortingOrderForQuery(sortBy, sortDirection);

  const where =
    casesType === CASES_TYPE.ARCHIVED
      ? {
          deletedAt: { [Op.ne]: null }
        }
      : {};

  const queryOptions = {
    where: where,
    paranoid: casesType === CASES_TYPE.WORKING,
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
