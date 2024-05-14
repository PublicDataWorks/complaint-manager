import { ALLEGATION_SEVERITY } from "../sharedUtilities/constants";

class OfficerAllegation {
  constructor(build) {
    this.id = build.id;
    this.details = build.details;
    this.severity = build.severity;
    this.caseOfficerId = build.caseOfficerId;
    this.createdAt = build.createdAt;
    this.allegationId = build.allegationId;
    this.customDirective = build.customDirective;
  }

  static get Builder() {
    class Builder {
      defaultOfficerAllegation() {
        this.id = 1;
        this.details = "Allegation Details";
        this.severity = ALLEGATION_SEVERITY.LOW;
        this.caseOfficerId = 1;
        this.createdAt = new Date();
        this.allegationId = 1;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withCaseOfficerId(id) {
        this.caseOfficerId = id;
        return this;
      }

      withDetails(details) {
        this.details = details;
        return this;
      }

      withSeverity(severity) {
        this.severity = severity;
        return this;
      }

      withAllegationId(id) {
        this.allegationId = id;
        return this;
      }

      withCustomDirective(customDirective) {
        this.customDirective = customDirective;
        return this;
      }

      build() {
        return new OfficerAllegation(this);
      }
    }

    return Builder;
  }
}

export default OfficerAllegation;
