const models = require("../../models/index");
const Op = require("sequelize").Op;

const searchAllegations = async (request, response, next) => {
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

  try {
    const allegations = await models.allegation.findAll({
      where: whereClause,
      order: [["rule", "ASC"]]
    });
    response.send(allegations);
  } catch (error) {
    next(error);
  }
};

module.exports = searchAllegations;
