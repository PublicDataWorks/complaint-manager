import models from "../../../models";
import Sequelize from "sequelize";
import { addToExistingAuditDetails } from "../../getQueryAuditAccessDetails";

const Op = Sequelize.Op;

export const CASES_TYPE = {
  ARCHIVED: "ARCHIVED",
  WORKING: "WORKING"
};

const getCases = async (casesType, transaction, auditDetails = null) => {
  const where =
    casesType === CASES_TYPE.ARCHIVED
      ? {
          deletedAt: { [Op.ne]: null }
        }
      : {};

  const queryOptions = {
    attributes: [
      "id",
      "complaintType",
      "caseNumber",
      "year",
      "status",
      "firstContactDate",
      "assignedTo"
    ],
    where: where,
    paranoid: casesType === CASES_TYPE.WORKING,
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
    ],
    order: [
      [
        { model: models.civilian, as: "complainantCivilians" },
        "createdAt",
        "ASC"
      ],
      [
        { model: models.case_officer, as: "complainantOfficers" },
        "createdAt",
        "ASC"
      ],
      [
        { model: models.case_officer, as: "accusedOfficers" },
        "createdAt",
        "ASC"
      ]
    ],
    transaction
  };

  const cases = await models.cases.findAll(queryOptions);

  addToExistingAuditDetails(auditDetails, queryOptions, models.cases.name);

  return cases;
};

export default getCases;
