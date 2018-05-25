const models = require("../../models/index");
const asyncMiddleware = require("../asyncMiddleware");
const Op = require("sequelize").Op;

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

  const officers = await models.officer.findAll({
    where: whereClause,
    order: [["last_name", "ASC"], ["first_name", "ASC"]]
  });
  response.send(officers);
});

module.exports = searchOfficers;
