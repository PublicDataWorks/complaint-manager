class ReferralLetterCaseClassification {
  constructor(build) {
    this.id = build.id;
    this.classificationId = build.classificationId;
    this.caseId = build.caseId;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetterCaseClassification() {
        this.id = 4;
        this.caseId = null;
        this.classificationId = 1;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withClassificationId(classificationId) {
        this.classificationId = classificationId;
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

export default ReferralLetterCaseClassification;
