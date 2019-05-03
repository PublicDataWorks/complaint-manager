class CaseNote {
  constructor(build) {
    this.caseId = build.caseId;
    this.id = build.id;
    this.user = build.user;
    this.caseNoteActionId = build.caseNoteActionId;
    this.actionTakenAt = build.actionTakenAt;
    this.notes = build.notes;
  }

  static get Builder() {
    class Builder {
      defaultCaseNote() {
        this.id = undefined;
        this.caseId = undefined;
        this.user = "tuser";
        this.caseNoteActionId = null;
        this.actionTakenAt = new Date().toISOString();
        this.notes = "i wrote notes";
        return this;
      }

      withCaseId(caseId) {
        this.caseId = caseId;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withUser(user) {
        this.user = user;
        return this;
      }

      withCaseNoteActionId(caseNoteActionId) {
        this.caseNoteActionId = caseNoteActionId;
        return this;
      }

      withActionTakenAt(actionTakenAt) {
        this.actionTakenAt = actionTakenAt;
        return this;
      }

      withNotes(notes) {
        this.notes = notes;
        return this;
      }

      build() {
        return new CaseNote(this);
      }
    }

    return Builder;
  }
}

export default CaseNote;
