import {
  AUDIT_ACTION,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import transformAuditsToCaseHistory from "./transformAuditsToCaseHistory";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../complaintManager/models");

const getCaseHistory = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;

  const caseHistoryAudits = await models.sequelize.transaction(
    async transaction => {
      let {
        dataChangeAudits,
        dataChangeAuditDetails,
        uploadAudits,
        uploadAuditDetails
      } = await getDataChangeAndUploadAuditsAndAuditDetails(
        caseId,
        transaction
      );

      const auditDetails = combineAuditDetails(
        dataChangeAuditDetails,
        uploadAuditDetails
      );

      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_HISTORY,
        auditDetails,
        transaction
      );

      return {
        dataChangeAudits: dataChangeAudits,
        uploadAudits: uploadAudits
      };
    }
  );
  const caseHistory = transformAuditsToCaseHistory(caseHistoryAudits);
  response.status(200).send(caseHistory);
});

const getDataChangeAndUploadAuditsAndAuditDetails = async (
  caseId,
  transaction
) => {
  let dataChangeAudits,
    uploadAudits,
    dataChangeAuditDetails,
    uploadAuditDetails,
    dataChangeAuditsAndAuditDetails,
    uploadAuditsAndAuditDetails;

  dataChangeAuditsAndAuditDetails = await getDataChangeAuditsAndAuditDetails(
    caseId,
    transaction
  );
  uploadAuditsAndAuditDetails = await getUploadAuditsAndAuditDetails(
    caseId,
    transaction
  );

  dataChangeAudits = dataChangeAuditsAndAuditDetails.dataChangeAudits;
  dataChangeAuditDetails = dataChangeAuditsAndAuditDetails.auditDetails;

  uploadAudits = uploadAuditsAndAuditDetails.uploadAudits;
  uploadAuditDetails = uploadAuditsAndAuditDetails.auditDetails;

  return {
    dataChangeAudits: dataChangeAudits,
    dataChangeAuditDetails: dataChangeAuditDetails,
    uploadAudits: uploadAudits,
    uploadAuditDetails: uploadAuditDetails
  };
};

const getDataChangeAuditsAndAuditDetails = async (caseId, transaction) => {
  const queryOptions = {
    where: {
      auditAction: {
        [models.Sequelize.Op.or]: [
          AUDIT_ACTION.DATA_UPDATED,
          AUDIT_ACTION.DATA_RESTORED,
          AUDIT_ACTION.DATA_ARCHIVED,
          AUDIT_ACTION.DATA_CREATED,
          AUDIT_ACTION.DATA_DELETED
        ]
      },
      managerType: MANAGER_TYPE.COMPLAINT,
      referenceId: caseId
    },
    attributes: ["auditAction", "user", "createdAt"],
    include: [
      {
        model: models.data_change_audit,
        as: "dataChangeAudit",
        attributes: ["modelName", "modelDescription", "changes"]
      }
    ],
    transaction
  };

  const dataChangeAudits = await models.audit.findAll(queryOptions);

  const dataChangeAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.audit.name
  );

  return {
    dataChangeAudits: dataChangeAudits,
    auditDetails: dataChangeAuditDetails
  };
};

const getUploadAuditsAndAuditDetails = async (caseId, transaction) => {
  const queryOptions = {
    where: {
      auditAction: AUDIT_ACTION.UPLOADED,
      referenceId: caseId,
      managerType: "complaint"
    },
    attributes: ["auditAction", "user", "createdAt"],
    include: [
      {
        model: models.file_audit,
        as: "fileAudit",
        attributes: ["fileType", "fileName"]
      }
    ],
    transaction
  };

  const uploadAudits = await models.audit.findAll(queryOptions);

  const uploadAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.audit.name
  );

  return { uploadAudits: uploadAudits, auditDetails: uploadAuditDetails };
};

module.exports = getCaseHistory;
