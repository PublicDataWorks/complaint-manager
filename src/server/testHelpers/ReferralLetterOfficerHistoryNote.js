class ReferralLetterOfficerHistoryNote {
  constructor(build) {
    this.id = build.id;
    this.referralLetterOfficerId = build.referralLetterOfficerId;
    this.pibCaseNumber = build.pibCaseNumber;
    this.details = build.details;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetterOfficerHistoryNote() {
        this.id = 8;
        this.referralLetterOfficerId = 22;
        this.pibCaseNumber = "CC2209-9870";
        this.details = "This case was very similar.";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withReferralLetterOfficerId(referralLetterOfficerId) {
        this.referralLetterOfficerId = referralLetterOfficerId;
        return this;
      }

      withPibCaseNumber(pibCaseNumber) {
        this.pibCaseNumber = pibCaseNumber;
        return this;
      }

      withDetails(details) {
        this.details = details;
        return this;
      }
    }
    return Builder;
  }
}

export default ReferralLetterOfficerHistoryNote;
