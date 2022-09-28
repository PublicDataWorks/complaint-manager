class Feature {
  constructor(build) {
    this.name = build.name;
    this.description = build.description;
    this.enabled = build.enabled;
    this.isDev = build.isDev;
  }
  static get Builder() {
    class Builder {
      defaultFeature() {
        this.name = "testFeatureName";
        this.description = "testFeatureDescription";
        this.enabled = true;
        this.isDev = false;
        return this;
      }

      withName(name) {
        this.name = name;
        return this;
      }

      withDescription(description) {
        this.description = description;
        return this;
      }

      withEnabled(enabled) {
        this.enabled = enabled;
        return this;
      }

      withIsDev(isDev) {
        this.isDev = isDev;
        return this;
      }

      build() {
        return new Feature(this);
      }
    }

    return Builder;
  }
}

export default Feature;
