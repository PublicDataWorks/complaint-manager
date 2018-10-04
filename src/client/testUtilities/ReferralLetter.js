class ReferralLetter {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetter() {
        const id = 4;

        this.id = id;
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
    }
    return Builder;
  }
}

export default ReferralLetter;
