class ReferralLetter {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.includeRetaliationConcerns = build.includeRetaliationConcerns;
    this.recipient = build.recipient;
    this.sender = build.sender;
    this.transcribedBy = build.transcribedBy;
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

      withRecipient(recipient) {
        this.recipient = recipient;
        return this;
      }

      withSender(sender) {
        this.sender = sender;
        return this;
      }

      withTranscribedBy(transcribedBy) {
        this.transcribedBy = transcribedBy;
        return this;
      }
    }
    return Builder;
  }
}

export default ReferralLetter;
