import { CASE_VIEWED } from "../../sharedUtilities/constants";

class ActionAudit {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.user = build.user;
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
        this.action = CASE_VIEWED;
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
