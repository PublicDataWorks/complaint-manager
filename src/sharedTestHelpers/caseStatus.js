class CaseStatus {
  constructor(build) {
    this.id = build.id;
    this.name = build.name;
    this.orderKey = build.orderKey;
  }

  static get Builder() {
    class Builder {
      defaultCaseStatus() {
        this.id = 1;
        this.name = "Initial";
        this.orderKey = 0;
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

      withOrderKey(orderKey) {
        this.orderKey = orderKey;
        return this;
      }

      build() {
        return new CaseStatus(this);
      }
    }

    return Builder;
  }
}

export default CaseStatus;