import models from "../../models/index";
import asyncMiddleware from "../asyncMiddleware";
import {
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT as PAGE_SIZE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../auditDataAccess";

const getCases = asyncMiddleware(async (req, res) => {
  const result = await models.sequelize.transaction(async transaction => {
    await audit(req.nickname, transaction)
    const { pageSize = PAGE_SIZE, page = 0 } = req.query;
    return await models.cases.findAndCountAll(
      {
        include: [...includes, ...orderIncludes],
        order: getOrder(req.query),
        limit: pageSize,
        offset: pageSize * page
      },
      { transaction }
    );
  });

  res.status(200).send({ cases: result.rows, count: result.count });
});

const audit = (nickname, transaction) =>
  auditDataAccess(nickname, undefined, AUDIT_SUBJECT.ALL_CASES, transaction)

const getOrder = ({ sortBy='id', sortDirection='desc' }) => {
  const orderings = {
    accusedOfficer: [
      ["accusedOfficers", "lastName", sortDirection]
    ],
    complainant: [
      ["complainantCivilians", "lastName", sortDirection],
      ["complainantOfficers", "lastName", sortDirection]
    ]
  };
  return orderings[sortBy] || [[sortBy, sortDirection]];
}

const includes = [
  { model: models.civilian, as: "complainantCivilians" },
  { model: models.case_officer, as: "complainantOfficers" },
  { model: models.case_officer, as: "accusedOfficers" }
];

const orderIncludes = includes.map(include => ({
  ...include,
  separate: true,
  order: [['createdAt', 'desc']]
}));

module.exports = getCases;
