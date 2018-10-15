class ReferralLetterOfficerRecommendedAction {
  constructor(build) {
    this.id = build.id;
    this.referralLetterOfficerId = build.referralLetterOfficerId;
    this.recommendedActionId = build.recommendedActionId;
  }

  static get Builder() {
    class Builder {
      defaultReferralLetterOfficerRecommendedAction() {
        this.id = 4;
        this.referralLetterOfficerId = 47;
        this.recommendedActionId = 6;
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

      withRecommendedActionId(recommendedActionId) {
        this.recommendedActionId = recommendedActionId;
        return this;
      }
    }
    return Builder;
  }
}

export default ReferralLetterOfficerRecommendedAction;
