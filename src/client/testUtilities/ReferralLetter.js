class ReferralLetter {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.includeRetaliationConcerns = build.includeRetaliationConcerns;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetter() {
        this.id = 4;
        this.caseId = 40;
        this.includeRetaliationConcerns = true;
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

      withIncludeRetaliationConcerns(include) {
        this.includeRetaliationConcerns = include;
        return this;
      }
    }
    return Builder;
  }
}

export default ReferralLetter;
