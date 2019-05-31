import models from "../../../models";
import {
  endOfLegacyAuditTimestamps,
  getDataChangeAuditsAndActionAuditsQuery,
  migrationExecutionTimes
} from "./auditTransformHelpers";
import {
  ASCENDING,
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import _ from "lodash";
import moment from "moment-timezone";

export const provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes = async () => {
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
      if (dataChangeAuditBeforeCaseNoteAccess(audits[auditIndex])) {
        auditIndex = await updateCorrespondingCaseNoteAccessAuditDetailsIfExists(
          auditIndex,
          audits,
          transaction
        );
      } else if (
        auditIsCaseNotesAccess(audits[auditIndex]) &&
        _.isEmpty(audits[auditIndex].audit_details)
      ) {
        /*
         * It is possible that a case note was saved, and editCaseNote was called, but no data actually changed,
         * so a dataChangeAudit was not created, but the caseNotes were still returned, created a data access audit.
         * This would only happen if the case note was edited, and not if it was created or deleted, so we assume in this
         * case that the audit action was DATA_UPDATED
         */
        await updateAuditDetailsForCaseNotesAccess(
          audits[auditIndex],
          AUDIT_ACTION.DATA_UPDATED,
          transaction
        );
      }
    }
  });
};

export const dataChangeAuditBeforeCaseNoteAccess = audit => {
  return (
    (audit.action === AUDIT_ACTION.DATA_CREATED &&
      audit.subject === "Case Note") ||
    (audit.action === AUDIT_ACTION.DATA_UPDATED &&
      audit.subject === "Case Note") ||
    (audit.action === AUDIT_ACTION.DATA_DELETED &&
      audit.subject === "Case Note")
  );
};

const updateCorrespondingCaseNoteAccessAuditDetailsIfExists = async (
  dataChangeAuditIndex,
  audits,
  transaction
) => {
  const dataChangeAction = audits[dataChangeAuditIndex].action;
  let auditIndex;
  for (
    auditIndex = dataChangeAuditIndex + 1;
    auditIndex < audits.length;
    auditIndex++
  ) {
    if (auditIsCaseNotesAccess(audits[auditIndex])) {
      if (_.isEmpty(audits[auditIndex].audit_details)) {
        await updateAuditDetailsForCaseNotesAccess(
          audits[auditIndex],
          dataChangeAction,
          transaction
        );
      }
      return auditIndex;
    }
  }
};

const auditIsCaseNotesAccess = audit => {
  return (
    audit.action === AUDIT_ACTION.DATA_ACCESSED &&
    audit.subject === AUDIT_SUBJECT.CASE_NOTES
  );
};

const updateAuditDetailsForCaseNotesAccess = async (
  audit,
  dataChangeAction,
  transaction
) => {
  const auditDetails = { "Case Note": ["All Case Note Data"] };
  const caseNoteActionAddedTime =
    migrationExecutionTimes.migration20190424[process.env.NODE_ENV];
  if (
    moment(audit.created_at).isAfter(caseNoteActionAddedTime) &&
    dataChangeAction !== AUDIT_ACTION.DATA_DELETED
  ) {
    auditDetails["Case Note Action"] = ["All Case Note Action Data"];
  }
  await models.action_audit.update(
    {
      auditDetails
    },
    { where: { id: audit.id }, transaction }
  );
};

export const setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes = async () => {
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
      if (dataChangeAuditBeforeCaseNoteAccess(audits[auditIndex])) {
        auditIndex = await setCorrespondingCaseNoteAccessAuditDetailsToEmptyIfExists(
          auditIndex,
          audits,
          transaction
        );
      }
    }
  });
};

const setCorrespondingCaseNoteAccessAuditDetailsToEmptyIfExists = async (
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
    if (auditIsCaseNotesAccess(audits[auditIndex])) {
      await setAuditDetailsForCaseNotesAccessToEmpty(
        audits[auditIndex].id,
        transaction
      );
      return auditIndex;
    }
  }
};

const setAuditDetailsForCaseNotesAccessToEmpty = async (
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
