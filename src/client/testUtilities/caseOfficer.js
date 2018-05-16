import Officer from "./Officer";

class CaseOfficer {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.officerId = build.officerId;
    this.notes = build.notes;
    this.roleOnCase = build.roleOnCase;
    this.officer = build.officer;
  }

  static get Builder() {
    class Builder {
      defaultCaseOfficer() {
        this.id = 23;
        this.caseId = 17;
        this.officer = new Officer.Builder().defaultOfficer().build();
        this.officerId = this.officer.id;
        this.roleOnCase = "Accused";
        this.notes = "Some notes about this officer's history";

        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withCaseId(caseId) {
        this.caseId = caseId;
        return this;
      }

      withOfficer(officer) {
        this.officer = officer;
        this.officerId = officer ? officer.id : null;

        return this;
      }

      withRoleOnCase(roleOnCase) {
        this.roleOnCase = roleOnCase;
        return this;
      }

      withNotes(notes) {
        this.notes = notes;
        return this;
      }

      build() {
        return new CaseOfficer(this);
      }
    }

    return Builder;
  }
}

export default CaseOfficer;
