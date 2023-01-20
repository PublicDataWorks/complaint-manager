import { COMPLAINANT } from "../sharedUtilities/constants";

class CaseInmate {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.inmateId = build.inmateId;
    this.roleOnCase = build.roleOnCase;
    this.isAnonymous = build.isAnonymous;
  }

  static get Builder() {
    class Builder {
      defaultCaseInmate() {
        this.roleOnCase = COMPLAINANT;
        this.isAnonymous = false;
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

      withRoleOnCase(roleOnCase) {
        this.roleOnCase = roleOnCase;
        return this;
      }

      withInmateId(inmateId) {
        this.inmateId = inmateId;
        return this;
      }

      withIsAnonymous(isAnonymous) {
        this.isAnonymous = isAnonymous;
        return this;
      }

      build() {
        return new CaseInmate(this);
      }
    }

    return Builder;
  }
}

export default CaseInmate;
