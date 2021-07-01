import {
  CASE_STATUS,
  CIVILIAN_INITIATED
} from "../../../sharedUtilities/constants";
import { getPersonFullName } from "../../../sharedUtilities/getFullName";

class SortableCase {
  constructor(build) {
    this.id = build.id;
    this.complaintType = build.complaintType;
    this.status = build.status;
    this.caseReference = build.caseReference;
    this.firstContactDate = build.firstContactDate;
    this.deletedAt = build.deletedAt;
    this.assignedTo = build.assignedTo;
    this.tagNames = build.tagNames;
    this.primaryComplainant = build.primaryComplainant;
    this.accusedOfficers = build.accusedOfficers;
  }

  static get Builder() {
    class Builder {
      defaultSortableCase() {
        this.id = undefined;
        this.complaintType = CIVILIAN_INITIATED;
        this.status = CASE_STATUS.INITIAL;
        this.caseReference = "CC2018-0001";
        this.firstContactDate = new Date().toISOString();
        this.deletedAt = "null";
        this.assignedTo = "someone";
        this.tagNames = [];
        this.primaryComplainant = null;
        this.accusedOfficers = [];
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withComplaintType(complaintType) {
        this.complaintType = complaintType;
        return this;
      }

      withStatus(status) {
        this.status = status;
        return this;
      }

      withCaseReference(caseReference) {
        this.caseReference = caseReference;
        return this;
      }

      withFirstContactDate(firstContactDate) {
        this.firstContactDate = firstContactDate;
        return this;
      }

      withAssignedTo(assignedTo) {
        this.assignedTo = assignedTo;
        return this;
      }

      withTagNames(tagNames) {
        this.tagNames = tagNames;
        return this;
      }

      addTagName(tagName) {
        this.tagNames.push(tagName);
        return this;
      }

      build() {
        return new SortableCase(this);
      }
      withPrimaryComplainant(primaryComplainant) {
        this.primaryComplainant = {
          fullName: getPersonFullName(
            primaryComplainant.firstName,
            primaryComplainant.middleName,
            primaryComplainant.lastName,
            primaryComplainant.suffix,
            primaryComplainant.personType
          ),
          personType: primaryComplainant.personType
        };
        return this;
      }
      withAccusedOfficer(accusedOfficer) {
        this.accusedOfficers.push({
          fullName: getPersonFullName(
            accusedOfficer.firstName,
            accusedOfficer.middleName,
            accusedOfficer.lastName,
            accusedOfficer.suffix,
            accusedOfficer.personType
          ),
          personType: accusedOfficer.personType
        });
        return this;
      }
      withAccusedOfficers(accusedOfficers) {
        accusedOfficers.forEach(accusedOfficer =>
          this.withAccusedOfficer(accusedOfficer)
        );
        return this;
      }
    }

    return Builder;
  }
}

export default SortableCase;
