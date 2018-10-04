class Classification {
  constructor(build) {
    this.id = build.id;
    this.initialism = build.initialism;
    this.name = build.name;
  }
  static get Builder() {
    class Builder {
      defaultClassification() {
        this.id = 17;
        this.initialism = "UTD";
        this.name = "Unable to Determine";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withInitialism(initialism) {
        this.initialism = initialism;
        return this;
      }

      withName(name) {
        this.name = name;
        return this;
      }

      build() {
        return new Classification(this);
      }
    }
    return Builder;
  }
}

export default Classification;
