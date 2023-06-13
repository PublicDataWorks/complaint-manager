import { COMPLAINANT } from "../sharedUtilities/constants";

class CaseInmate {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.inmateId = build.inmateId || build.inmate?.inmateId;
    this.roleOnCase = build.roleOnCase;
    this.isAnonymous = build.isAnonymous;
    this.inmate = build.inmate;
    this.firstName = build.firstName;
    this.middleInitial = build.middleInitial;
    this.lastName = build.lastName;
    this.suffix = build.suffix;
    this.notFoundInmateId = build.notFoundInmateId;
    this.facility = build.facility;
    this.notes = build.notes;
    this.createdAt = build.createdAt;
  }

  static get Builder() {
    class Builder {
      defaultCaseInmate() {
        this.roleOnCase = COMPLAINANT;
        this.isAnonymous = false;
        this.createdAt = new Date();
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

      withInmate(inmate) {
        this.inmate = inmate;
        return this;
      }

      withFirstName(firstName) {
        this.firstName = firstName;
        return this;
      }

      withMiddleInitial(middleInitial) {
        this.middleInitial = middleInitial;
        return this;
      }

      withLastName(lastName) {
        this.lastName = lastName;
        return this;
      }

      withSuffix(suffix) {
        this.suffix = suffix;
        return this;
      }

      withNotFoundInmateId(notFoundInmateId) {
        this.notFoundInmateId = notFoundInmateId;
        return this;
      }

      withFacility(facility) {
        this.facility = facility;
        return this;
      }

      withNotes(notes) {
        this.notes = notes;
        return this;
      }

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
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
