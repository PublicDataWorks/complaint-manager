class ReferralLetterIAProCorrection {
  constructor(build) {
    this.id = build.id;
    this.referralLetterId = build.referralLetterId;
    this.details = build.details;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetterIAProCorrection() {
        this.id = 90;
        this.referralLetterId = 80;
        this.details = "The IAPro entry for case 555 was wrong.";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }
      withReferralLetterId(referralLetterId) {
        this.referralLetterId = referralLetterId;
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

export default ReferralLetterIAProCorrection;
