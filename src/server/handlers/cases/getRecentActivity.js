const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../models/index");

const getRecentActivity = asyncMiddleWare(async (request, response) => {
  const recentActivity = await models.case_note.findAll({
    where: {
      caseId: request.params.id
    }
  });

  response.send(recentActivity);
});

module.exports = getRecentActivity;
