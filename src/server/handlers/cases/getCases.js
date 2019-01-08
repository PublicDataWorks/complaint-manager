import models from "../../models/index";
import asyncMiddleware from "../asyncMiddleware";
import { AUDIT_SUBJECT } from "../../../sharedUtilities/constants";
import auditDataAccess from "../auditDataAccess";

const getCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    await audit(req.nickname, transaction);
    return await models.cases.findAll(
      {
        order: getOrder(req.query),
        include: [...includes, ...orderIncludes]
      },
      { transaction }
    );
  });

  res.status(200).send({ cases });
});

const audit = (nickname, transaction) =>
  auditDataAccess(nickname, undefined, AUDIT_SUBJECT.ALL_CASES, transaction);

const getOrder = ({ sortBy = "id", sortDirection = "desc" }) => {
  const orderings = {
    accusedOfficer: [["accusedOfficers", "lastName", sortDirection]],
    complainant: [
      ["complainantCivilians", "lastName", sortDirection],
      ["complainantOfficers", "lastName", sortDirection]
    ]
  };
  return orderings[sortBy] || [[sortBy, sortDirection]];
};

const includes = [
  { model: models.civilian, as: "complainantCivilians" },
  { model: models.case_officer, as: "complainantOfficers" },
  { model: models.case_officer, as: "accusedOfficers" }
];

const orderIncludes = includes.map(include => ({
  ...include,
  separate: true,
  order: [["createdAt", "asc"]]
}));

module.exports = getCases;
