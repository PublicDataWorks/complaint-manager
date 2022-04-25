class Signer {
  constructor(build) {
    this.id = build.id;
    this.name = build.name;
    this.signatureFile = build.signatureFile;
    this.nickname = build.nickname;
    this.title = build.title;
    this.phone = build.phone;
  }

  //TODO: Builders are not usually part of the class that they're building.  The class is usually a domain object used in the app, not just tests.  Should this be refactored?
  static get Builder() {
    class Builder {
      defaultSigner() {
        this.id = 17;
        this.name = "Bobby";
        this.signatureFile = "bobby.png";
        this.nickname = "Bob@bobby.com";
        this.title = "Chief Bobby";
        this.phone = "512-459-2222";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withName(name) {
        this.name = name;
        return this;
      }

      withSignatureFile(signatureFile) {
        this.signatureFile = signatureFile;
        return this;
      }

      withNickname(nickname) {
        this.nickname = nickname;
        return this;
      }

      withTitle(title) {
        this.title = title;
        return this;
      }

      withPhone(phone) {
        this.phone = phone;
        return this;
      }

      build() {
        return new Signer(this);
      }
    }

    return Builder;
  }
}

export default Signer;
