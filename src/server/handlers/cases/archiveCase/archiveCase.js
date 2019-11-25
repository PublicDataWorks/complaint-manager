const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../complaintManager/models/index");

const archiveCase = asyncMiddleware(async (request, response, next) => {
  await models.sequelize.transaction(async transaction => {
    const caseId = request.params.caseId;

    await models.cases.destroy({
      where: { id: caseId },
      individualHooks: true,
      auditUser: request.nickname,
      transaction
    });
  });

  response.status(200).send();
});

export default archiveCase;
