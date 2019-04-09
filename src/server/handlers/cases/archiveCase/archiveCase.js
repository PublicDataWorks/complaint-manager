import { getCaseWithAllAssociations } from "../../getCaseHelpers";

const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models/index");

const archiveCase = asyncMiddleware(async (request, response, next) => {
  const updatedCase = await models.sequelize.transaction(async transaction => {
    const caseId = request.params.caseId;

    await models.cases.destroy({
      where: { id: caseId },
      individualHooks: true,
      auditUser: request.nickname,
      transaction
    });

    return await getCaseWithAllAssociations(caseId, transaction);
  });

  response.status(200).send(updatedCase);
});

export default archiveCase;
