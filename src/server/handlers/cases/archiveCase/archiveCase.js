const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");

const archiveCase = asyncMiddleware(async (request, reponce, next) => {
  await models.sequelize.transaction(async transaction => {
    const caseId = request.body.case.id;

    await models.cases.destroy({
      where: { id: caseId },
      individualHooks: true,
      auditUser: request.nickname,
      transaction
    });
  });
});

export default archiveCase;
