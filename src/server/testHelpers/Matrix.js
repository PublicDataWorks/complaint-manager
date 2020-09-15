class Matrix {
  constructor(build) {
    this.id = build.id;
    this.name = build.pibControlNumber;
    this.createdAt = build.createdAt;
    this.updatedAt = build.updatedAt;
    this.deletedAt = build.deletedAt;
    this.firstReviewer = build.firstReviewer;
    this.secondReviewer = build.secondReviewer;
  }

  static get Builder() {
    class Builder {
      defaultMatrix() {
        this.id = undefined;
        this.pibControlNumber = "2019-2019-R";
        this.createdAt = undefined;
        this.updatedAt = undefined;
        this.deletedAt = undefined;
        this.firstReviewer = "penguin";
        this.secondReviewer = "boot";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withPibControlNumber(pibControlNumber) {
        this.pibControlNumber = pibControlNumber;
        return this;
      }

      withFirstReviewer(firstReviewer) {
        this.firstReviewer = firstReviewer;
        return this;
      }

      withSecondReviewer(secondReviewer) {
        this.secondReviewer = secondReviewer;
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

      withDeletedAt(deletedAt) {
        this.deletedAt = deletedAt;
        return this;
      }

      build() {
        return new Matrix(this);
      }
    }

    return Builder;
  }
}

export default Matrix;
