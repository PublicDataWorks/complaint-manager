class District {
  constructor(build) {
    this.name = build.name;
  }

  static get Builder() {
    class Builder {
      defaultDistrict() {
        this.name = "1st District";
        return this;
      }

      withName(name) {
        this.name = name;
        return this;
      }

      build() {
        return new District(this);
      }
    }

    return Builder;
  }
}

export default District;
