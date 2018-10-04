const models = require("../../../models/index");
const {
  AUDIT_SUBJECT,
  DEFAULT_PAGINATION_LIMIT
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const Op = require("sequelize").Op;
const auditDataAccess = require("../../auditDataAccess");

const searchOfficers = asyncMiddleware(async (request, response) => {
  const whereClause = {};

  if (request.query.firstName) {
    whereClause.first_name = { [Op.iLike]: `${request.query.firstName}%` };
  }
  if (request.query.lastName) {
    whereClause.last_name = { [Op.iLike]: `${request.query.lastName}%` };
  }
  if (request.query.district) {
    whereClause.district = { [Op.eq]: `${request.query.district}` };
  }

  const offset = request.query.page
    ? (request.query.page - 1) * DEFAULT_PAGINATION_LIMIT
    : null;

  const officers = await models.sequelize.transaction(async transaction => {
    const officers = await models.officer.findAndCountAll({
      where: whereClause,
      order: [["last_name", "ASC"], ["first_name", "ASC"]],
      limit: DEFAULT_PAGINATION_LIMIT,
      offset: offset,
      transaction
    });

    await auditDataAccess(
      request.nickname,
      undefined,
      AUDIT_SUBJECT.OFFICER_DATA,
      transaction
    );

    return officers;
  });

  response.send(officers);
});

module.exports = searchOfficers;
