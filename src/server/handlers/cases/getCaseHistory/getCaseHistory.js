const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const transformAuditToCaseHistory = require("./transformAuditToCaseHistory");
const models = require("../../../models");
const auditDataAccess = require("../../auditDataAccess");

const getCaseHistory = asyncMiddleware(async (request, response) => {
  const caseId = request.params.id;
  const dataChangeAudits = await models.sequelize.transaction(
    async transaction => {
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

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_HISTORY,
        transaction
      );

      return dataChangeAudits;
    }
  );
  const caseHistory = transformAuditToCaseHistory(dataChangeAudits);
  response.status(200).send(caseHistory);
});

module.exports = getCaseHistory;
