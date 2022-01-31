import moment from "moment";

class CaseNoteAction {
  constructor(build) {
    this.id = build.id;
    this.name = build.name;
    this.createdAt = build.createdAt;
    this.updatedAt = build.updatedAt;
  }

  static get Builder() {
    class Builder {
      defaultCaseNoteAction() {
        this.id = 1;
        this.name = "Default Case Note Action";
        this.createdAt = moment();
        this.updatedAt = moment();
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withName(name) {
        this.name = name;
        return this;
      }

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
      }

      withUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
        return this;
      }

      build() {
        return new CaseNoteAction(this);
      }
    }

    return Builder;
  }
}

export default CaseNoteAction;
