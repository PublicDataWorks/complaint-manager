class Allegation {
  constructor(build) {
    this.id = build.id;
    this.rule = build.rule;
    this.paragraph = build.paragraph;
    this.directive = build.directive;
  }

  static get Builder() {
    class Builder {
      defaultAllegation() {
        this.id = 9;
        this.rule = "RULE 2: MORAL CONDUCT";
        this.paragraph = "PARAGRAPH 01 - ADHERENCE TO LAW";
        this.directive =
          "Title 18 of the United Stated Code Section 1001: Statements or Entries Generally";
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withRule(rule) {
        this.rule = rule;
        return this;
      }

      withParagraph(paragraph) {
        this.paragraph = paragraph;
        return this;
      }

      withDirective(directive) {
        this.directive = directive;
        return this;
      }

      build() {
        return new Allegation(this);
      }
    }

    return Builder;
  }
}

export default Allegation;
