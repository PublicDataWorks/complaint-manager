import Signer from "./signer";

class LetterType {
  constructor(build) {
    this.id = build.id;
    this.type = build.type;
    this.defaultSenderId = build.defaultSenderId
      ? build.defaultSenderId
      : build.defaultSender.id;
  }

  //TODO: Builders are not usually part of the class that they're building.  The class is usually a domain object used in the app, not just tests.  Should this be refactored?
  static get Builder() {
    class Builder {
      defaultLetterType() {
        this.id = 17;
        this.type = "Referral";
        this.defaultSender = new Signer.Builder().defaultSigner().build();
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withType(type) {
        this.type = type;
        return this;
      }

      withDefaultSender(defaultSender) {
        this.defaultSender = defaultSender;
        return this;
      }

      withDefaultSenderId(defaultSenderId) {
        this.defaultSenderId = defaultSenderId;
        return this;
      }

      build() {
        return new LetterType(this);
      }
    }

    return Builder;
  }
}

export default LetterType;
