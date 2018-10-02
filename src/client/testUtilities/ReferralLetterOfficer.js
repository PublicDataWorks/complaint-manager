class ReferralLetterOfficer {
  constructor(build) {
    this.id = build.id;
    this.caseOfficerId = build.caseOfficerId;
    this.referralLetterId = build.referralLetterId;
    this.numHistoricalHighAllegations = build.numHistoricalHighAllegations;
    this.numHistoricalMedAllegations = build.numHistoricalMedAllegations;
    this.numHistoricalLowAllegations = build.numHistoricalLowAllegations;
    this.historicalBehaviorNotes = build.historicalBehaviorNotes;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetterOfficer() {
        this.id = 123;
        this.caseOfficerId = 55;
        this.referralLetterId = 99;
        this.numHistoricalHighAllegations = 3;
        this.numHistoricalMedAllegations = 2;
        this.numHistoricalLowAllegations = 1;
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

      withnumHistoricalHighAllegations(numHistoricalHighAllegations) {
        this.numHistoricalHighAllegations = numHistoricalHighAllegations;
        return this;
      }

      withnumHistoricalMedAllegations(numHistoricalMedAllegations) {
        this.numHistoricalMedAllegations = numHistoricalMedAllegations;
        return this;
      }

      withnumHistoricalLowAllegations(numHistoricalLowAllegations) {
        this.numHistoricalLowAllegations = numHistoricalLowAllegations;
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
