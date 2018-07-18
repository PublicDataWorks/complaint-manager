const models = require("../models");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../sharedUtilities/constants");

const SUBJECT_DETAILS = {
  [AUDIT_SUBJECT.CASE_DETAILS]: [
    "Case",
    "Incident Location",
    "Complainants",
    "Civilian Address",
    "Witnesses",
    "Accused Officers",
    "Allegations",
    "Attachments"
  ],
  [AUDIT_SUBJECT.ALL_CASES]: ["Cases", "Complainants", "Accused Officers"],
  [AUDIT_SUBJECT.CASE_HISTORY]: [
    "Case",
    "Incident Location",
    "Complainants",
    "Civilian Address",
    "Witnesses",
    "Accused Officers",
    "Allegations",
    "Attachments",
    "Case Notes"
  ],
  [AUDIT_SUBJECT.CASE_NOTES]: ["Case Notes"],
  [AUDIT_SUBJECT.OFFICER_DATA]: ["Officers"]
};

const auditDataAccess = async (
  user,
  caseId,
  subject,
  transaction,
  action = DATA_ACCESSED,
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
        action === DATA_ACCESSED ? SUBJECT_DETAILS[subject] : subjectDetails
    },
    { transaction }
  );
};

module.exports = auditDataAccess;
