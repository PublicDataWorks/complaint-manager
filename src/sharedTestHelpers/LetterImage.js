class LetterImage {
  constructor(build) {
    this.id = build.id;
    this.image = build.image;
  }

  static get Builder() {
    class Builder {
      defaultLetterImage() {
        this.id = 1;
        this.image = "header_text.png";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withImage(image) {
        this.image = image;
        return this;
      }

      build() {
        return new LetterImage(this);
      }
    }

    return Builder;
  }
}

export default LetterImage;
