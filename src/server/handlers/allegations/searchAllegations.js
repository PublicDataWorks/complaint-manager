const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models/index");
const Op = require("sequelize").Op;

const searchAllegations = asyncMiddleware(async (request, response) => {
  const whereClause = {};
  if (request.query.rule) {
    whereClause.rule = { [Op.eq]: `${request.query.rule}` };
  }

  if (request.query.paragraph) {
    whereClause.paragraph = { [Op.eq]: `${request.query.paragraph}` };
  }

  if (request.query.directive) {
    whereClause.directive = { [Op.iLike]: `%${request.query.directive}%` };
  }

  const allegations = await models.allegation.findAndCountAll({
    where: whereClause,
    order: [["rule", "ASC"]],
    limit: request.query.limit,
    offset: request.query.offset
  });

  response.send(allegations);
});

module.exports = searchAllegations;
