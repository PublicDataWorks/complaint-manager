import { CONFIGS } from "../sharedUtilities/constants";

class Config {
  constructor(build) {
    this.name = build.name;
    this.value = build.value;
    this.createdAt = build.createdAt;
    this.updatedAt = build.updatedAt;
  }

  static get Builder() {
    class Builder {
      defaultConfig() {
        this.name = CONFIGS.ORGANIZATION;
        this.value = "OIPM";
        this.createdAt = new Date();
        this.updatedAt = new Date();
        return this;
      }

      withName(name) {
        this.name = name;
        return this;
      }

      withValue(value) {
        this.value = value;
        return this;
      }

      build() {
        return new Config(this);
      }
    }

    return Builder;
  }
}

export default Config;
