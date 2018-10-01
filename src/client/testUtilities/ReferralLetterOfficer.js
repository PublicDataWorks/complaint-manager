class ReferralLetterOfficer {
  constructor(build) {
    this.id = build.id;
    this.caseOfficerId = build.caseOfficerId;
    this.referralLetterId = build.referralLetterId;
    this.numberHistoricalHighAllegations =
      build.numberHistoricalHighAllegations;
    this.numberHistoricalMediumAllegations =
      build.numberHistoricalMediumAllegations;
    this.numberHistoricalLowAllegations = build.numberHistoricalLowAllegations;
    this.historicalBehaviorNotes = build.historicalBehaviorNotes;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetterOfficer() {
        this.id = 123;
        this.caseOfficerId = 55;
        this.referralLetterId = 99;
        this.numberHistoricalHighAllegations = 3;
        this.numberHistoricalMediumAllegations = 2;
        this.numberHistoricalLowAllegations = 1;
        this.historicalBehaviorNotes = "This is a pattern";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withCaseOfficerId(caseOfficerId) {
        this.caseOfficerId = caseOfficerId;
        return this;
      }

      withReferralLetterId(referralLetterId) {
        this.referralLetterId = referralLetterId;
        return this;
      }

      withNumberHistoricalHighAllegations(numberHistoricalHighAllegations) {
        this.numberHistoricalHighAllegations = numberHistoricalHighAllegations;
        return this;
      }

      withNumberHistoricalMediumAllegations(numberHistoricalMediumAllegations) {
        this.numberHistoricalMediumAllegations = numberHistoricalMediumAllegations;
        return this;
      }

      withNumberHistoricalLowAllegations(numberHistoricalLowAllegations) {
        this.numberHistoricalLowAllegations = numberHistoricalLowAllegations;
        return this;
      }

      withHistoricalBehaviorNotes(historicalBehaviorNotes) {
        this.historicalBehaviorNotes = historicalBehaviorNotes;
        return this;
      }
    }
    return Builder;
  }
}

export default ReferralLetterOfficer;
