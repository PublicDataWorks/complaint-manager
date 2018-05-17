import { DATA_UPDATED } from "../../sharedUtilities/constants";

class DataChangeAudit {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.modelName = build.modelName;
    this.modelId = build.modelId;
    this.snapshot = build.snapshot;
    this.action = build.action;
    this.changes = build.changes;
    this.user = build.user;
    this.createdAt = build.createdAt;
  }

  static get Builder() {
    class Builder {
      defaultDataChangeAudit() {
        this.id = 22;
        this.caseId = 1;
        this.modelName = "case";
        this.modelId = 1;
        this.snapshot = {};
        this.action = DATA_UPDATED;
        this.changes = {};
        this.user = "nickname";
        this.createdAt = new Date().toISOString();
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
      withModelName(modelName) {
        this.modelName = modelName;
        return this;
      }
      withModelId(modelId) {
        this.modelId = modelId;
        return this;
      }
      withSnapshot(snapshot) {
        this.snapshot = snapshot;
        return this;
      }
      withAction(action) {
        this.action = action;
        return this;
      }
      withChanges(changes) {
        this.changes = changes;
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
    }
    return Builder;
  }
}

export default DataChangeAudit;
