const models = require("../../../../models");
const asyncMiddleware = require("../../../asyncMiddleware");

const getRecommendedActions = asyncMiddleware(
  async (request, response, next) => {
    const recommendedActions = await models.recommended_action.findAll({
      attributes: ["id", "description"],
      raw: true
    });

    response.status(200).send(recommendedActions);
  }
);

module.exports = getRecommendedActions;
