import {
  AUDIT_ACTION,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import transformAuditsToCaseHistory from "./transformAuditsToCaseHistory";
import getQueryAuditAccessDetails, {
  combineAuditDetails
} from "../../audits/getQueryAuditAccessDetails";
import legacyAuditDataAccess from "../../audits/legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../audits/auditDataAccess";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");

const getCaseHistory = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const caseHistoryAudits = await models.sequelize.transaction(
    async transaction => {
      let {
        dataChangeAudits,
        dataChangeAuditDetails,
        uploadAudits,
        uploadAuditDetails
      } = await getDataChangeAndUploadAuditsAndAuditDetails(
        caseId,
        transaction,
        newAuditFeatureToggle
      );

      const auditDetails = combineAuditDetails(
        dataChangeAuditDetails,
        uploadAuditDetails
      );

      if (newAuditFeatureToggle) {
        await auditDataAccess(
          request.nickname,
          request.params.caseId,
          AUDIT_SUBJECT.CASE_HISTORY,
          auditDetails,
          transaction
        );
      } else {
        await legacyAuditDataAccess(
          request.nickname,
          caseId,
          AUDIT_SUBJECT.CASE_HISTORY,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      }

      return {
        dataChangeAudits: dataChangeAudits,
        uploadAudits: uploadAudits
      };
    }
  );
  const caseHistory = transformAuditsToCaseHistory(
    caseHistoryAudits,
    newAuditFeatureToggle
  );
  response.status(200).send(caseHistory);
});

const getDataChangeAndUploadAuditsAndAuditDetails = async (
  caseId,
  transaction,
  newAuditFeatureToggle
) => {
  let dataChangeAudits,
    uploadAudits,
    dataChangeAuditDetails,
    uploadAuditDetails,
    dataChangeAuditsAndAuditDetails,
    uploadAuditsAndAuditDetails;

  // TODO remove following else statement when removing newAuditFeatureToggle flag
  if (newAuditFeatureToggle) {
    dataChangeAuditsAndAuditDetails = await getDataChangeAuditsAndAuditDetails(
      caseId,
      transaction
    );
    uploadAuditsAndAuditDetails = await getUploadAuditsAndAuditDetails(
      caseId,
      transaction
    );
  } else {
    dataChangeAuditsAndAuditDetails = await getLegacyDataChangeAuditsAndAuditDetails(
      caseId,
      transaction
    );
    uploadAuditsAndAuditDetails = await getLegacyUploadAuditsAndAuditDetails(
      caseId,
      transaction
    );
  }

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
        [models.sequelize.Op.or]: [
          AUDIT_ACTION.DATA_UPDATED,
          AUDIT_ACTION.DATA_RESTORED,
          AUDIT_ACTION.DATA_ARCHIVED,
          AUDIT_ACTION.DATA_CREATED,
          AUDIT_ACTION.DATA_DELETED
        ]
      },
      caseId: caseId
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
    where: { auditAction: AUDIT_ACTION.UPLOADED, caseId: caseId },
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

const getLegacyUploadAuditsAndAuditDetails = async (caseId, transaction) => {
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

const getLegacyDataChangeAuditsAndAuditDetails = async (
  caseId,
  transaction
) => {
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
  const dataChangeAudits = await models.legacy_data_change_audit.findAll(
    queryOptions
  );

  const dataChangeAuditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.legacy_data_change_audit.name
  );

  return {
    dataChangeAudits: dataChangeAudits,
    auditDetails: dataChangeAuditDetails
  };
};

module.exports = getCaseHistory;
