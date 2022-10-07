class LetterTypeLetterImage {
  constructor(build) {
    this.id = build.id;
    this.imageId = build.imageId;
    this.letterId = build.letterId;
    this.maxWidth = build.maxWidth;
    this.name = build.name;
  }

  static get Builder() {
    class Builder {
      defaultLetterTypeLetterImage() {
        this.id = 1;
        this.imageId = 1;
        this.letterId = 17;
        this.maxWidth = "450px";
        this.name = "header";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withImageId(imageId) {
        this.imageId = imageId;
        return this;
      }

      withLetterId(letterId) {
        this.letterId = letterId;
        return this;
      }

      withMaxWidth(maxWidth) {
        this.maxWidth = maxWidth;
        return this;
      }

      withName(name) {
        this.name = name;
        return this;
      }

      build() {
        return new LetterTypeLetterImage(this);
      }
    }

    return Builder;
  }
}

export default LetterTypeLetterImage;
