import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  AUDIT_ACTION
} from "../../sharedUtilities/constants";

class ActionAudit {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.user = build.user;
    this.subject = build.subject;
    this.subjectId = build.subjectId;
    this.subjectDetails = build.subjectDetails;
    this.auditType = build.auditType;
    this.action = build.action;
    this.createdAt = build.createdAt;
    this.updatedAt = build.updatedAt;
  }

  static get Builder() {
    class Builder {
      defaultActionAudit() {
        this.id = 11111;
        this.caseId = 17;
        this.user = "Bobby";
        this.subject = AUDIT_SUBJECT.CASE_DETAILS;
        this.subjectId = null;
        this.subjectDetails = null;
        this.action = AUDIT_ACTION.DATA_ACCESSED;
        this.auditType = AUDIT_TYPE.DATA_ACCESS;
        this.createdAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withCaseId(caseId) {
        this.caseId = caseId;
        return this;
      }

      withAction(action) {
        this.action = action;
        return this;
      }

      withAuditType(auditType) {
        this.auditType = auditType;
        return this;
      }

      withSubject(subject) {
        this.subject = subject;
        return this;
      }
      withSubjectId(subjectId) {
        this.subjectId = subjectId;
        return this;
      }

      withSubjectDetails(subjectDetails) {
        this.subjectDetails = subjectDetails;
        return this;
      }

      withUser(user) {
        this.user = user;
        return this;
      }

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
      }

      build() {
        return new ActionAudit(this);
      }
    }

    return Builder;
  }
}

export default ActionAudit;
