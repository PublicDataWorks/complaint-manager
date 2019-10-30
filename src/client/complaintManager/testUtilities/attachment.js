class Attachment {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.fileName = build.fileName;
    this.description = build.description;
  }

  static get Builder() {
    class Builder {
      defaultAttachment() {
        this.id = 17;
        this.caseId = 17;
        this.fileName = "test_file.pdf";
        this.description = "test description";

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

      withFileName(fileName) {
        this.fileName = fileName;
        return this;
      }

      withDescription(description) {
        this.description = description;
        return this;
      }

      build() {
        return new Attachment(this);
      }
    }

    return Builder;
  }
}

export default Attachment;
