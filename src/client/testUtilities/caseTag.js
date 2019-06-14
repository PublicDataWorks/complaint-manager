class CaseTag {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.tagId = build.tagId;
  }

  static get Builder() {
    class Builder {
      defaultCaseTag() {
        this.id = undefined;
        this.caseId = undefined;
        this.tagId = undefined;
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

      withTagId(tagId) {
        this.tagId = tagId;
        return this;
      }

      build() {
        return new CaseTag(this);
      }
    }

    return Builder;
  }
}

export default CaseTag;
