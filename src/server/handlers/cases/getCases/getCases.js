import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";

const getCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      req.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_CASES,
      transaction
    );

    return await models.cases.findAll(
      {
        ...getCasesOptions
      },
      { transaction }
    );
  });

  res.status(200).send({ cases });
});

export const getCasesOptions = {
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
    [{ model: models.case_officer, as: "accusedOfficers" }, "createdAt", "ASC"]
  ]
};

module.exports = getCases;
