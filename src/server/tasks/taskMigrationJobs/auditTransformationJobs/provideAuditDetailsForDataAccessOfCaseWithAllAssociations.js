import models from "../../../models";
import {
  ASCENDING,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import _ from "lodash";
import {
  endOfLegacyAuditTimestamps,
  getDataChangeAuditsAndActionAuditsQuery
} from "./auditTransformHelpers";

export const getCaseWithAllAssociationsLegacyAuditDetails = {
  Case: [
    "Assigned To",
    "Case Number",
    "Classification Id",
    "Complaint Type",
    "Created At",
    "Created By",
    "District",
    "First Contact Date",
    "How Did You Hear About Us Source Id",
    "Id",
    "Incident Date",
    "Incident Time",
    "Intake Source Id",
    "Is Archived",
    "Narrative Details",
    "Narrative Summary",
    "Pdf Available",
    "Pib Case Number",
    "Status",
    "Updated At",
    "Year"
  ],
  Address: ["All Address Data"],
  Allegation: ["All Allegation Data"],
  Attachment: ["All Attachment Data"],
  Allegations: ["All Allegations Data"],
  "Intake Source": ["All Intake Source Data"],
  Classification: ["All Classification Data"],
  "Race Ethnicity": ["All Race Ethnicity Data"],
  "Gender Identity": ["All Gender Identity Data"],
  "Accused Officers": ["All Accused Officers Data"],
  "Witness Officers": ["All Witness Officers Data"],
  "Incident Location": ["All Incident Location Data"],
  "Witness Civilians": ["All Witness Civilians Data"],
  "Complainant Officers": ["All Complainant Officers Data"],
  "Complainant Civilians": ["All Complainant Civilians Data"],
  "How Did You Hear About Us Source": [
    "All How Did You Hear About Us Source Data"
  ]
};

export const provideAuditDetailsForDataAccessOfCaseWithAllAssociations = async () => {
  await models.sequelize.transaction(async transaction => {
    const audits = await models.sequelize.query(
      getDataChangeAuditsAndActionAuditsQuery(
        endOfLegacyAuditTimestamps[process.env.NODE_ENV]
      ),
      {
        type: models.sequelize.QueryTypes.SELECT,
        order: [["createdAt", ASCENDING]]
      }
    );

    for (let auditIndex = 0; auditIndex < audits.length; auditIndex++) {
      await updateCurrentAuditIfCaseDetailsAccessAndAuditDetailsEmpty(
        audits[auditIndex],
        transaction
      );
    }
  });
};

const updateCurrentAuditIfCaseDetailsAccessAndAuditDetailsEmpty = async (
  audit,
  transaction
) => {
  if (auditIsCaseDetailsAccess(audit)) {
    if (_.isEmpty(audit.audit_details)) {
      await updateAuditDetailsForCaseDetailsAccess(audit.id, transaction);
    }
  }
};

const updateAuditDetailsForCaseDetailsAccess = async (auditId, transaction) => {
  await models.action_audit.update(
    {
      auditDetails: getCaseWithAllAssociationsLegacyAuditDetails
    },
    { where: { id: auditId }, transaction }
  );
};

export const setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations = async () => {
  await models.sequelize.transaction(async transaction => {
    const audits = await models.sequelize.query(
      getDataChangeAuditsAndActionAuditsQuery(
        endOfLegacyAuditTimestamps[process.env.NODE_ENV]
      ),
      {
        type: models.sequelize.QueryTypes.SELECT,
        order: [["createdAt", ASCENDING]]
      }
    );

    for (let auditIndex = 0; auditIndex < audits.length; auditIndex++) {
      if (dataChangeAuditCalledGetCaseWithAllAssociations(audits[auditIndex])) {
        auditIndex = await setCorrespondingCaseDetailsToEmptyIfExists(
          auditIndex,
          audits,
          transaction
        );
      }
    }
  });
};

const setCorrespondingCaseDetailsToEmptyIfExists = async (
  dataChangeAuditIndex,
  audits,
  transaction
) => {
  let auditIndex;
  for (
    auditIndex = dataChangeAuditIndex + 1;
    auditIndex < audits.length;
    auditIndex++
  ) {
    if (dataChangeAuditCalledGetCaseWithAllAssociations(audits[auditIndex])) {
      return auditIndex - 1;
    }
    if (auditIsCaseDetailsAccess(audits[auditIndex])) {
      await setAuditDetailsForCaseDetailsAccessToEmpty(
        audits[auditIndex].id,
        transaction
      );
      return auditIndex;
    }
  }
};

const setAuditDetailsForCaseDetailsAccessToEmpty = async (
  auditId,
  transaction
) => {
  await models.action_audit.update(
    {
      auditDetails: {}
    },
    { where: { id: auditId }, transaction }
  );
};

export const dataChangeAuditCalledGetCaseWithAllAssociations = audit => {
  return (
    (audit.action === AUDIT_ACTION.DATA_DELETED &&
      audit.subject === "Officer Allegation") ||
    (audit.action === AUDIT_ACTION.DATA_CREATED &&
      audit.subject === "Officer Allegation") ||
    (audit.action === AUDIT_ACTION.DATA_UPDATED &&
      audit.subject === "Officer Allegation") ||
    (audit.action === AUDIT_ACTION.DATA_DELETED &&
      audit.subject === "Civilian") ||
    (audit.action === AUDIT_ACTION.DATA_CREATED &&
      audit.subject === "Civilian") ||
    (audit.action === AUDIT_ACTION.DATA_UPDATED &&
      audit.subject === "Civilian") ||
    (audit.action === AUDIT_ACTION.DATA_DELETED &&
      audit.subject === "Case Officer") ||
    (audit.action === AUDIT_ACTION.DATA_UPDATED &&
      audit.subject === "Case Officer") ||
    (audit.action === AUDIT_ACTION.DATA_CREATED &&
      audit.subject === "Case Officer") ||
    (audit.action === AUDIT_ACTION.DATA_UPDATED && audit.subject === "Case") ||
    (audit.action === AUDIT_ACTION.DATA_CREATED &&
      audit.subject === "Attachment") ||
    (audit.action === AUDIT_ACTION.DATA_DELETED &&
      audit.subject === "Attachment") ||
    (audit.action === AUDIT_ACTION.DATA_CREATED && audit.subject === "Case") ||
    (audit.action === AUDIT_ACTION.DATA_CREATED &&
      audit.subject === "Case Note") ||
    (audit.action === AUDIT_ACTION.DATA_DELETED &&
      audit.subject === "Case Note")
  );
};

const auditIsCaseDetailsAccess = audit => {
  return (
    audit.action === AUDIT_ACTION.DATA_ACCESSED &&
    audit.subject === AUDIT_SUBJECT.CASE_DETAILS
  );
};
