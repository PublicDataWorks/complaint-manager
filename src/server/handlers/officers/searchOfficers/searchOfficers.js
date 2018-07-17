const models = require("../../../models/index");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
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

  const officers = await models.sequelize.transaction(async transaction => {
    const officers = await models.officer.findAll({
      where: whereClause,
      order: [["last_name", "ASC"], ["first_name", "ASC"]],
      transaction
    });

    await auditDataAccess(
      request.nickname,
      request.query.caseId,
      AUDIT_SUBJECT.OFFICER_DATA,
      transaction
    );

    return officers;
  });

  response.send(officers);
});

module.exports = searchOfficers;
