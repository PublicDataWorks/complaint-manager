import { ASCENDING } from "../../../sharedUtilities/constants";

const {
  DEFAULT_PAGINATION_LIMIT
} = require("../../../sharedUtilities/constants");

const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../policeDataManager/models/index");
const Op = require("sequelize").Op;

const searchAllegations = asyncMiddleware(async (request, response) => {
  const whereClause = {
    deletedAt: null
  };
  if (request.query.rule) {
    whereClause.rule = { [Op.eq]: `${request.query.rule}` };
  }

  if (request.query.paragraph) {
    whereClause.paragraph = { [Op.eq]: `${request.query.paragraph}` };
  }

  if (request.query.directive) {
    whereClause.directive = { [Op.iLike]: `%${request.query.directive}%` };
  }

  const offset = request.query.page
    ? (request.query.page - 1) * DEFAULT_PAGINATION_LIMIT
    : null;

  const allegations = await models.allegation.findAndCountAll({
    where: whereClause,
    order: [
      ["rule", ASCENDING],
      ["paragraph", ASCENDING],
      ["directive", ASCENDING]
    ],
    limit: DEFAULT_PAGINATION_LIMIT,
    offset: offset
  });

  response.send(allegations);
});

module.exports = searchAllegations;
