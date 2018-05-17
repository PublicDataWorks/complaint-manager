const transformAuditToCaseHistory = require("./transformAuditToCaseHistory");
const models = require("../../../models");

const getCaseHistory = async (request, response, next) => {
  try {
    const caseId = request.params.id;
    const audits = await models.data_change_audit.findAll({
      where: { caseId: caseId },
      attributes: ["id", "action", "modelName", "changes", "user", "createdAt"],
      order: [["createdAt", "desc"]],
      raw: true
    });
    const caseHistory = transformAuditToCaseHistory(audits);
    response.status(200).send(caseHistory);
  } catch (error) {
    next(error);
  }
};

module.exports = getCaseHistory;
