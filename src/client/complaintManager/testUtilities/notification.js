class Notification {
  constructor(build) {
    this.id = build.id;
    this.caseNoteId = build.caseNoteId;
    this.user = build.user;
    this.hasBeenRead = build.hasBeenRead;
  }

  static get Builder() {
    class Builder {
      defaultNotification() {
        this.id = undefined;
        this.caseNoteId = undefined;
        this.user = "tuser";
        this.hasBeenRead = false;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withCaseNoteId(caseNoteId) {
        this.caseNoteId = caseNoteId;
        return this;
      }

      withUser(user) {
        this.user = user;
        return this;
      }

      withHasBeenRead(hasBeenRead) {
        this.hasBeenRead = hasBeenRead;
        return this;
      }

      build() {
        return new Notification(this);
      }
    }

    return Builder;
  }
}

export default Notification;
