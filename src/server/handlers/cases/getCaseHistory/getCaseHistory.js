const {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  DATA_VIEWED
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const transformAuditToCaseHistory = require("./transformAuditToCaseHistory");
const models = require("../../../models");

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

      await models.action_audit.create(
        {
          user: request.nickname,
          action: DATA_VIEWED,
          subject: AUDIT_SUBJECT.CASE_HISTORY,
          auditType: AUDIT_TYPE.PAGE_VIEW,
          caseId
        },
        { transaction }
      );

      return dataChangeAudits;
    }
  );

  const caseHistory = transformAuditToCaseHistory(dataChangeAudits);
  response.status(200).send(caseHistory);
});

module.exports = getCaseHistory;
