import { AUDIT_TYPE } from "../../../../sharedUtilities/constants";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";
const models = require("../../../models");
const auditDataAccess = require("../../auditDataAccess");

const getCaseHistory = asyncMiddleware(async (request, response) => {
  const caseId = request.params.id;
  const caseHistoryAudits = await models.sequelize.transaction(
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

      const uploadAudits = await models.action_audit.findAll({
        where: { auditType: AUDIT_TYPE.UPLOAD, caseId: caseId },
        attributes: ["action", "user", "createdAt", "subject"],
        raw: true
      });

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_HISTORY,
        transaction
      );
      return { dataChangeAudits: dataChangeAudits, uploadAudits: uploadAudits };
    }
  );
  const caseHistory = transformAuditToCaseHistory(caseHistoryAudits);
  response.status(200).send(caseHistory);
});

module.exports = getCaseHistory;
