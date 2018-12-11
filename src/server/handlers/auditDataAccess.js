const models = require("../models");
const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../sharedUtilities/constants");

const SUBJECT_DETAILS = {
  [AUDIT_SUBJECT.REFERRAL_LETTER_DATA]: ["Referral Letter Data"],
  [AUDIT_SUBJECT.REFERRAL_LETTER]: ["Case Data", "Referral Letter Data"],
  [AUDIT_SUBJECT.CASE_DETAILS]: [
    "Case Information",
    "Incident Location",
    "Civilian Complainants",
    "Officer Complainants",
    "Civilian Witnesses",
    "Officer Witnesses",
    "Civilian Address",
    "Accused Officers",
    "Allegations",
    "Attachments"
  ],
  [AUDIT_SUBJECT.ALL_CASES]: [
    "Case Information",
    "Civilian Complainants",
    "Officer Complainants",
    "Accused Officers"
  ],
  [AUDIT_SUBJECT.CASE_HISTORY]: [
    "Case Information",
    "Incident Location",
    "Civilian Complainants",
    "Officer Complainants",
    "Civilian Witnesses",
    "Officer Witnesses",
    "Civilian Address",
    "Accused Officers",
    "Allegations",
    "Attachments",
    "Case Notes"
  ],
  [AUDIT_SUBJECT.CASE_NOTES]: ["Case Notes"],
  [AUDIT_SUBJECT.OFFICER_DATA]: ["Officers"],
  [AUDIT_SUBJECT.CASE_NUMBER]: ["Case Number"]
};

const auditDataAccess = async (
  user,
  caseId,
  subject,
  transaction,
  action = AUDIT_ACTION.DATA_ACCESSED,
  subjectDetails
) => {
  await models.action_audit.create(
    {
      user,
      caseId,
      action,
      auditType: AUDIT_TYPE.DATA_ACCESS,
      subject,
      subjectDetails:
        action === AUDIT_ACTION.DATA_ACCESSED
          ? SUBJECT_DETAILS[subject]
          : subjectDetails
    },
    { transaction }
  );
};

module.exports = auditDataAccess;
