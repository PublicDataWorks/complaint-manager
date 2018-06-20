class OfficerAllegation {
  constructor(build) {
    this.id = build.id;
    this.details = build.details;
    this.caseOfficerId = build.caseOfficerId;
    this.createdAt = build.createdAt;
    this.allegationId = build.allegationId;
  }

  static get Builder() {
    class Builder {
      defaultOfficerAllegation() {
        this.id = 1;
        this.details = "Allegation Details";
        this.caseOfficerId = 1;
        this.createdAt = new Date();
        this.allegationId = 1;
        return this;
      }

      withCaseOfficerId(id) {
        this.caseOfficerId = id;
        return this;
      }

      withAllegationId(id) {
        this.allegationId = id;
        return this;
      }

      build() {
        return new OfficerAllegation(this);
      }
    }

    return Builder;
  }
}

export default OfficerAllegation;
