const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");

const restoreArchivedCase = asyncMiddleware(async (request, response, next) => {
  await models.sequelize.transaction(async transaction => {
    const caseId = request.params.caseId;

    await models.cases.restore({
      where: { id: caseId },
      auditUser: request.nickname,
      transaction
    });
  });
  response.status(200).send();
});

export default restoreArchivedCase;
