const asyncMiddleware = require("../../asyncMiddleware");
const transformAuditToCaseHistory = require("./transformAuditToCaseHistory");
const models = require("../../../models");

const getCaseHistory = asyncMiddleware(async (request, response) => {
  const caseId = request.params.id;
  const dataChangeAudits = await models.data_change_audit.findAll({
    where: { caseId: caseId },
    attributes: [
      "action",
      "modelName",
      "modelDescription",
      "changes",
      "user",
      "createdAt"
    ],
    raw: true
  });

  const actionAudits = await models.action_audit.findAll({
    where: { caseId: caseId },
    attributes: ["user", "createdAt", "action"]
  });

  const caseHistory = transformAuditToCaseHistory(
    dataChangeAudits,
    actionAudits
  );
  response.status(200).send(caseHistory);
});

module.exports = getCaseHistory;
