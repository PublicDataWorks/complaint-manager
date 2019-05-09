import {
  AUDIT_ACTION,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";
import { addToExistingAuditDetails } from "../../getQueryAuditAccessDetails";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
import legacyAuditDataAccess from "../../legacyAuditDataAccess";

const getCaseHistory = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const caseHistoryAudits = await models.sequelize.transaction(
    async transaction => {
      let auditDetails = {};

      const dataChangeAudits = await getDataChangeAudits(
        caseId,
        transaction,
        auditDetails
      );

      const uploadAudits = await getUploadAudits(
        caseId,
        transaction,
        auditDetails
      );

      await legacyAuditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_HISTORY,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );

      return {
        dataChangeAudits: dataChangeAudits,
        uploadAudits: uploadAudits
      };
    }
  );
  const caseHistory = transformAuditToCaseHistory(caseHistoryAudits);
  response.status(200).send(caseHistory);
});

const getUploadAudits = async (caseId, transaction, auditDetails) => {
  const queryOptions = {
    where: { auditType: AUDIT_TYPE.UPLOAD, caseId: caseId },
    attributes: ["action", "user", "createdAt", "subject"],
    raw: true,
    transaction
  };

  const uploadAudits = await models.action_audit.findAll(queryOptions);

  addToExistingAuditDetails(
    auditDetails,
    queryOptions,
    models.action_audit.name
  );

  return uploadAudits;
};

const getDataChangeAudits = async (caseId, transaction, auditDetails) => {
  const queryOptions = {
    where: { caseId: caseId },
    attributes: [
      "action",
      "modelName",
      "modelDescription",
      "changes",
      "user",
      "createdAt"
    ],
    raw: true,
    transaction
  };
  const dataChangeAudits = await models.data_change_audit.findAll(queryOptions);

  addToExistingAuditDetails(
    auditDetails,
    queryOptions,
    models.data_change_audit.name
  );

  return dataChangeAudits;
};

module.exports = getCaseHistory;
