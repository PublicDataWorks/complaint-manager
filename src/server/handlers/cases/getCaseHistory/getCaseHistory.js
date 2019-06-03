import {
  AUDIT_ACTION,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import transformAuditToCaseHistory from "./transformAuditToCaseHistory";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../audits/getQueryAuditAccessDetails";
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");

const getCaseHistory = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const caseHistoryAudits = await models.sequelize.transaction(
    async transaction => {
      const dataChangeAuditsAndAuditDetails = await getDataChangeAuditsAndAuditDetails(
        caseId,
        transaction
      );
      const dataChangeAudits = dataChangeAuditsAndAuditDetails.dataChangeAudits;
      const dataChangeAuditDetails =
        dataChangeAuditsAndAuditDetails.auditDetails;

      const uploadAuditsAndAuditDetails = await getUploadAuditsAndAuditDetails(
        caseId,
        transaction
      );
      const uploadAudits = uploadAuditsAndAuditDetails.uploadAudits;
      const uploadAuditDetails = uploadAuditsAndAuditDetails.auditDetails;

      const auditDetails = combineAuditDetails(
        dataChangeAuditDetails,
        uploadAuditDetails
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

const getUploadAuditsAndAuditDetails = async (caseId, transaction) => {
  const queryOptions = {
    where: { auditType: AUDIT_TYPE.UPLOAD, caseId: caseId },
    attributes: ["action", "user", "createdAt", "subject"],
    raw: true,
    transaction
  };

  const uploadAudits = await models.action_audit.findAll(queryOptions);

  const uploadAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.action_audit.name
  );

  return { uploadAudits: uploadAudits, auditDetails: uploadAuditDetails };
};

const getDataChangeAuditsAndAuditDetails = async (caseId, transaction) => {
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

  const dataChangeAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.data_change_audit.name
  );

  return {
    dataChangeAudits: dataChangeAudits,
    auditDetails: dataChangeAuditDetails
  };
};

module.exports = getCaseHistory;
