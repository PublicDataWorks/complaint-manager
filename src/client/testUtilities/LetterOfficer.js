class LetterOfficer {
  constructor(build) {
    this.id = build.id;
    this.caseOfficerId = build.caseOfficerId;
    this.numHistoricalHighAllegations = build.numHistoricalHighAllegations;
    this.numHistoricalMedAllegations = build.numHistoricalMedAllegations;
    this.numHistoricalLowAllegations = build.numHistoricalLowAllegations;
    this.historicalBehaviorNotes = build.historicalBehaviorNotes;
    this.recommendedActionNotes = build.recommendedActionNotes;
  }

  static get Builder() {
    class Builder {
      defaultLetterOfficer() {
        this.id = 123;
        this.caseOfficerId = 55;
        this.numHistoricalHighAllegations = 3;
        this.numHistoricalMedAllegations = 2;
        this.numHistoricalLowAllegations = 1;
        this.historicalBehaviorNotes = "This is a pattern";
        this.recommendedActionNotes = "This person should be watched.";
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

      withNumHistoricalHighAllegations(numHistoricalHighAllegations) {
        this.numHistoricalHighAllegations = numHistoricalHighAllegations;
        return this;
      }

      withNumHistoricalMedAllegations(numHistoricalMedAllegations) {
        this.numHistoricalMedAllegations = numHistoricalMedAllegations;
        return this;
      }

      withNumHistoricalLowAllegations(numHistoricalLowAllegations) {
        this.numHistoricalLowAllegations = numHistoricalLowAllegations;
        return this;
      }

      withHistoricalBehaviorNotes(historicalBehaviorNotes) {
        this.historicalBehaviorNotes = historicalBehaviorNotes;
        return this;
      }

      withRecommendedActionNotes(notes) {
        this.recommendedActionNotes = notes;
        return this;
      }
    }
    return Builder;
  }
}

export default LetterOfficer;
