const models = require("../../../../policeDataManager/models");
const asyncMiddleware = require("../../../asyncMiddleware");

const getOfficerHistoryOptions = asyncMiddleware(
  async (request, response, next) => {
    const officerHistoryOptions = await models.officer_history_option.findAll({
      attributes: ["id", "name"],
      raw: true
    });
    response.status(200).send(officerHistoryOptions);
  }
);

export default getOfficerHistoryOptions;
