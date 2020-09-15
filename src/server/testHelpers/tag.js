class Tag {
  constructor(build) {
    this.id = build.id;
    this.name = build.name;
    this.createdAt = build.createdAt;
    this.updatedAt = build.updatedAt;
  }

  static get Builder() {
    class Builder {
      defaultTag() {
        this.id = undefined;
        this.name = "testTagName";
        this.createdAt = undefined;
        this.updatedAt = undefined;
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

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
      }

      withUpdatedAt(updatedAt) {
        this.updatedAt = updatedAt;
        return this;
      }

      build() {
        return new Tag(this);
      }
    }

    return Builder;
  }
}

export default Tag;
