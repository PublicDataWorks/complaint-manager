import models from "../../../models";
import Sequelize from "sequelize";
const Op = Sequelize.Op;

export const CASES_TYPE = {
  ARCHIVED: "ARCHIVED",
  WORKING: "WORKING"
};

const getCases = async (transaction, casesType) => {
  const where =
    casesType === CASES_TYPE.ARCHIVED
      ? {
          deletedAt: { [Op.ne]: null }
        }
      : {};

  return await models.cases.findAll(
    {
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
      ]
    },
    { transaction }
  );
};

export default getCases;
