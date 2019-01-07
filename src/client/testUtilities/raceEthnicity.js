class RaceEthnicity {
  constructor(build) {
    this.id = build.id;
    this.name = build.name;
  }

  static get Builder() {
    class Builder {
      defaultRaceEthnicity() {
        this.id = 19;
        this.name = "Filipino";
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

      build() {
        return new RaceEthnicity(this);
      }
    }

    return Builder;
  }
}

export default RaceEthnicity;
