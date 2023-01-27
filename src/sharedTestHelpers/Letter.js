class Letter {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.typeId = build.typeId;
    this.recipient = build.recipient;
    this.recipientAddress = build.recipientAddress;
    this.sender = build.sender;
    this.transcribedBy = build.transcribedBy;
    this.editedLetterHtml = build.editedLetterHtml;
    this.finalPdfFilename = build.finalPdfFilename;
  }

  static get Builder() {
    class Builder {
      defaultLetter() {
        this.id = 1;
        this.recipient = "Sponge Bob";
        this.recipientAddress = "Bikini Bottom";
        this.sender = "Squidward";
        this.finalPdfFilename = "pinapple_house.pdf";
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

      withTypeId(typeId) {
        this.typeId = typeId;
        return this;
      }

      withRecipient(recipient) {
        this.recipient = recipient;
        return this;
      }

      withRecipientAddress(recipientAddress) {
        this.recipientAddress = recipientAddress;
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

      withEditedLetterHtml(editedLetterHtml) {
        this.editedLetterHtml = editedLetterHtml;
        return this;
      }

      withFinalPdfFilename(finalPdfFilename) {
        this.finalPdfFilename = finalPdfFilename;
        return this;
      }

      build() {
        return new Letter(this);
      }
    }
    return Builder;
  }
}

export default Letter;
