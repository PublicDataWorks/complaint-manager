class LetterField {
  constructor(build) {
    this.id = build.id;
    this.field = build.field;
    this.relation = build.relation;
    this.isRequired = build.isRequired;
    this.isForBody = build.isForBody;
    this.sortBy = build.sortBy;
    this.sortDirection = build.sortDirection;
  }

  //TODO: Builders are not usually part of the class that they're building.  The class is usually a domain object used in the app, not just tests.  Should this be refactored?
  static get Builder() {
    class Builder {
      defaultLetterField() {
        this.id = 17;
        this.field = "caseReference";
        this.relation = "cases";
        this.isRequired = false;
        this.isForBody = false;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withField(field) {
        this.field = field;
        return this;
      }

      withRelation(relation) {
        this.relation = relation;
        return this;
      }

      withIsRequired(isRequired) {
        this.isRequired = isRequired;
        return this;
      }

      withIsForBody(isForBody) {
        this.isForBody = isForBody;
        return this;
      }

      build() {
        return new LetterField(this);
      }
    }

    return Builder;
  }
}

export default LetterField;
