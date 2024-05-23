import Civilian from "./civilian";
import Attachment from "./attachment";
import Address from "./Address";
import CaseOfficer from "./caseOfficer";
import Officer from "./Officer";
import CaseStatus from "./caseStatus";
import {
  ACCUSED,
  ADDRESSABLE_TYPE,
  COMPLAINANT,
  WITNESS
} from "../sharedUtilities/constants";
import RaceEthnicity from "./raceEthnicity";

class Case {
  constructor(build) {
    this.id = build.id;
    this.accusedCivilians = build.accusedCivilians;
    this.complainantCivilians = build.complainantCivilians;
    this.witnessCivilians = build.witnessCivilians;
    this.complaintTypeId = build.complaintTypeId;
    this.statusId = build.statusId;
    this.status = build.status;
    this.createdAt = build.createdAt;
    this.firstContactDate = build.firstContactDate;
    this.createdBy = build.createdBy;
    this.assignedTo = build.assignedTo;
    this.narrativeDetails = build.narrativeDetails;
    this.narrativeSummary = build.narrativeSummary;
    this.attachments = build.attachments;
    this.incidentDate = build.incidentDate;
    this.incidentTime = build.incidentTime;
    this.incidentTimezone = build.incidentTimezone;
    this.incidentLocation = build.incidentLocation;
    this.priorityReasons = build.priorityReasons;
    this.priorityLevels = build.priorityLevels;
    this.district = build.district;
    this.districtId = build.districtId;
    this.caseDistrict = build.caseDistrict;
    this.accusedOfficers = build.accusedOfficers;
    this.complainantOfficers = build.complainantOfficers;
    this.witnessOfficers = build.witnessOfficers;
    this.accusedInmates = build.accusedInmates;
    this.complainantInmates = build.complainantInmates;
    this.witnessInmates = build.witnessInmates;
    this.caseReference = build.caseReference;
    this.intakeSourceId = build.intakeSourceId;
    this.deletedAt = build.deletedAt;
    this.primaryComplainant = build.primaryComplainant;
    this.isCase = build.isCase;
    this.pibCaseNumber = build.pibCaseNumber;
    if (build.defaultPersonType) {
      this.defaultPersonType = build.defaultPersonType;
    }
  }

  static get Builder() {
    const raceEthnicity = new RaceEthnicity.Builder()
      .defaultRaceEthnicity()
      .build();
    class Builder {
      defaultCase() {
        const id = 17;
        const complainantCivilian = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withId(23)
            .withRaceEthnicityId(raceEthnicity.id)
            .withRoleOnCase(COMPLAINANT)
            .build(),
          raceEthnicity
        };
        const witnessCivilian = {
          ...new Civilian.Builder()
            .defaultCivilian()
            .withId(32)
            .withNoAddress()
            .withRoleOnCase(WITNESS)
            .withRaceEthnicityId(raceEthnicity.id)
            .build(),
          raceEthnicity
        };
        const accusedOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(456)
          .withOfficerAttributes(
            new Officer.Builder()
              .defaultOfficer()
              .withId(456)
              .build()
          )
          .withCaseId(id)
          .withRoleOnCase(ACCUSED)
          .build();
        const complainantOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(654)
          .withOfficerAttributes(
            new Officer.Builder()
              .defaultOfficer()
              .withId(654)
              .build()
          )
          .withCaseId(id)
          .withRoleOnCase(COMPLAINANT)
          .build();
        const witnessOfficer = new CaseOfficer.Builder()
          .defaultCaseOfficer()
          .withId(565)
          .withOfficerAttributes(
            new Officer.Builder()
              .defaultOfficer()
              .withId(565)
              .build()
          )
          .withCaseId(id)
          .withRoleOnCase(WITNESS)
          .build();
        const attachment = new Attachment.Builder()
          .defaultAttachment()
          .withCaseId(id)
          .build();
        const incidentLocation = new Address.Builder()
          .defaultAddress()
          .withAddressableType(ADDRESSABLE_TYPE.CASES)
          .withAddressableId(id)
          .build();
        const status = new CaseStatus.Builder().defaultCaseStatus().build();

        this.id = id;
        this.accusedCivilians = [];
        this.complainantCivilians = [complainantCivilian];
        this.witnessCivilians = [witnessCivilian];
        this.statusId = 1;
        this.status = status;
        this.createdAt = "2015-09-13T05:00:00.000Z";
        this.firstContactDate = "2017-12-24";
        this.incidentDate = "2017-01-01";
        this.incidentTime = "16:00:00";
        this.incidentTimezone = "CST";
        this.incidentLocation = incidentLocation;
        this.district = null;
        this.districtId = null;
        this.priorityLevels = null;
        this.priorityReasons = null;
        this.caseDistrict = null;
        this.createdBy = "tuser";
        this.assignedTo = "tuser";
        this.narrativeDetails = "<p> test details </p>";
        this.narrativeSummary = "test summary";
        this.attachments = [attachment];
        this.accusedOfficers = [accusedOfficer];
        this.complainantOfficers = [complainantOfficer];
        this.witnessOfficers = [witnessOfficer];
        this.complainantInmates = [];
        this.witnessInmates = [];
        this.accusedInmates = [];
        this.year = "2017";
        this.deletedAt = null;
        this.isCase = true;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withAccusedCivilians(accusedCivilians) {
        this.accusedCivilians = accusedCivilians;
        return this;
      }

      withComplainantCivilians(complainantCivilians) {
        this.complainantCivilians = complainantCivilians;
        return this;
      }

      withWitnessCivilians(witnessCivilians) {
        this.witnessCivilians = witnessCivilians;
        return this;
      }

      withDistrict(district) {
        this.district = district;
        return this;
      }

      withDistrictId(districtId) {
        this.districtId = districtId;
        return this;
      }

      withCaseDistrict(caseDistrict) {
        this.caseDistrict = caseDistrict;
        return this;
      }

      withIntakeSourceId(intakeSourceId) {
        this.intakeSourceId = intakeSourceId;
        return this;
      }

      withComplaintTypeId(complaintTypeId) {
        this.complaintTypeId = complaintTypeId;
        return this;
      }

      withStatus(status) {
        this.status = status;
        return this;
      }

      withStatusId(statusId) {
        this.statusId = statusId;
        return this;
      }

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
      }

      withIncidentDate(incidentDate) {
        this.incidentDate = incidentDate;
        return this;
      }

      withIncidentTime(incidentTime) {
        this.incidentTime = incidentTime;
        return this;
      }

      withPriorityLevels(priorityLevels) {
        this.priorityLevels = priorityLevels;
        return this;
      }

      withPriorityReasons(priorityReasons) {
        this.priorityReasons = priorityReasons;
        return this;
      }

      withIncidentTimezone(incidentTimezone) {
        this.incidentTimezone = incidentTimezone;
        return this;
      }

      withIncidentLocation(incidentLocation) {
        this.incidentLocation = incidentLocation;
        return this;
      }

      withCreatedBy(createdBy) {
        this.createdBy = createdBy;
        return this;
      }

      withAssignedTo(assignedTo) {
        this.assignedTo = assignedTo;
        return this;
      }

      withFirstContactDate(firstContactDate) {
        this.firstContactDate = firstContactDate;
        return this;
      }

      withNarrativeDetails(narrativeDetails) {
        this.narrativeDetails = narrativeDetails;
        return this;
      }

      withNarrativeSummary(narrativeSummary) {
        this.narrativeSummary = narrativeSummary;
        return this;
      }

      withAttachments(attachments) {
        this.attachments = attachments;
        return this;
      }

      withAccusedOfficers(accusedOfficers) {
        this.accusedOfficers = accusedOfficers;
        return this;
      }

      withComplainantOfficers(complainantOfficers) {
        this.complainantOfficers = complainantOfficers;
        return this;
      }

      withWitnessOfficers(witnessOfficers) {
        this.witnessOfficers = witnessOfficers;
        return this;
      }

      withComplainantInmates(inmates) {
        this.complainantInmates = inmates;
        return this;
      }

      withWitnessInmates(inmates) {
        this.witnessInmates = inmates;
        return this;
      }

      withAccusedInmates(inmates) {
        this.accusedInmates = inmates;
        return this;
      }

      withDeletedAt(deletedAt) {
        this.deletedAt = deletedAt;
        return this;
      }

      withPrimaryComplainant(complainant) {
        this.primaryComplainant = complainant;
        return this;
      }

      withCaseNumber(caseNumber) {
        this.caseNumber = caseNumber;
        return this;
      }

      withYear(year) {
        this.year = year;
        return this;
      }

      withDefaultPersonType(defaultPersonType) {
        this.defaultPersonType = defaultPersonType;
        return this;
      }

      withPibCaseNumber(pibCaseNumber) {
        this.pibCaseNumber = pibCaseNumber;
        return this;
      }

      build() {
        return new Case(this);
      }
    }

    return Builder;
  }
}

export default Case;
