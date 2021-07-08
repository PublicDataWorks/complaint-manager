import { ACCUSED } from "../sharedUtilities/constants";
import { EMPLOYEE_TYPE } from "../instance-files/constants";

class CaseOfficer {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.officerId = build.officerId;
    this.notes = build.notes;
    this.roleOnCase = build.roleOnCase;
    this.fullName = build.fullName;
    this.firstName = build.firstName;
    this.middleInitial = build.middleInitial;
    this.lastName = build.lastName;
    this.supervisorFirstName = build.supervisorFirstName;
    this.supervisorMiddleInitial = build.supervisorMiddleInitial;
    this.supervisorLastName = build.supervisorLastName;
    this.windowsUsername = build.windowsUsername;
    this.supervisorWindowsUsername = build.supervisorWindowsUsername;
    this.supervisorOfficerNumber = build.supervisorOfficerNumber;
    this.rank = build.rank;
    this.race = build.race;
    this.sex = build.sex;
    this.dob = build.dob;
    this.bureau = build.bureau;
    this.district = build.district;
    this.workStatus = build.workStatus;
    this.hireDate = build.hireDate;
    this.endDate = build.endDate;
    this.employeeType = build.employeeType;
    this.caseEmployeeType = build.caseEmployeeType;
    this.isUnknownOfficer = build.isUnknownOfficer;
    this.createdAt = build.createdAt;
    this.allegations = build.allegations;
    this.isAnonymous = build.isAnonymous;
  }

  static get Builder() {
    class Builder {
      defaultCaseOfficer() {
        this.id = 23;
        this.caseId = 17;
        this.fullName = "Grant M. Young";
        this.firstName = "Grant";
        this.middleInitial = "M";
        this.lastName = "Young";
        this.supervisorFirstName = "Belly";
        this.supervisorMiddleInitial = "G";
        this.supervisorLastName = "Walsh";
        this.windowsUsername = 12;
        this.supervisorWindowsUsername = 14;
        this.supervisorOfficerNumber = 1;
        this.rank = "ADMIN SUPPORT SPECIALIST II";
        this.race = "Black";
        this.sex = "M";
        this.dob = "1986-02-23";
        this.phoneNumber = "8005882300";
        this.email = "empire@gmail.com";
        this.bureau = "MSB - Management Service Bureau";
        this.district = "First District";
        this.workStatus = "Retired";
        this.hireDate = "2018-05-30";
        this.endDate = "2018-05-31";
        this.employeeType = "Commissioned";
        this.caseEmployeeType = EMPLOYEE_TYPE.OFFICER;
        this.officerId = 123456;
        this.roleOnCase = ACCUSED;
        this.notes = "Some notes about this officer's history";
        this.isUnknownOfficer = false;
        this.createdAt = new Date();
        this.allegations = [];
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

      withDistrict(district) {
        this.district = district;
        return this;
      }

      withDistrict(district) {
        this.district = district;
        return this;
      }

      withUnknownOfficer() {
        this.firstName = null;
        this.middleInitial = null;
        this.lastName = null;
        this.windowsUsername = null;
        this.rank = null;
        this.race = null;
        this.sex = null;
        this.dob = null;
        this.bureau = null;
        this.district = null;
        this.workStatus = null;
        this.endDate = null;
        this.employeeType = null;
        this.officerId = null;
        this.fullName = "Unknown Officer";
        this.isUnknownOfficer = true;
        this.allegations = [];
        return this;
      }

      withOfficerAttributes(officer) {
        this.firstName = officer.firstName;
        this.middleInitial = officer.middleInitial;
        this.lastName = officer.lastName;
        this.windowsUsername = officer.windowsUsername;
        this.rank = officer.rank;
        this.race = officer.race;
        this.sex = officer.sex;
        this.dob = officer.dob;
        this.bureau = officer.bureau;
        this.district = officer.officerDistrict;
        this.workStatus = officer.workStatus;
        this.hireDate = officer.hireDate;
        this.endDate = officer.endDate;
        this.employeeType = officer.employeeType;
        this.officerId = officer.id;
        this.fullName = officer.fullName;
        return this;
      }

      withNoSupervisor() {
        this.supervisorFirstName = null;
        this.supervisorMiddleInitial = null;
        this.supervisorLastName = null;
        this.supervisorWindowsUsername = null;
        this.supervisorOfficerNumber = null;

        return this;
      }

      withSupervisor(officer) {
        this.supervisorFirstName = officer.firstName;
        this.supervisorMiddleInitial = officer.middleInitial;
        this.supervisorLastName = officer.lastName;
        this.supervisorWindowsUsername = officer.windowsUsername;
        this.supervisorOfficerNumber = officer.officerNumber;
        return this;
      }

      withOfficerAllegations(officerAllegations) {
        this.allegations = officerAllegations;
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

      withOfficerId(officerId) {
        this.officerId = officerId;
        return this;
      }

      withFullName(fullName) {
        this.fullName = fullName;
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

      withCreatedAt(createdAt) {
        this.createdAt = createdAt;
        return this;
      }

      withIsAnonymous(isAnonymous) {
        this.isAnonymous = isAnonymous;
        return this;
      }

      withCaseEmployeeType(caseEmployeeType) {
        this.caseEmployeeType = caseEmployeeType;
        return this;
      }

      withPhoneNumber(phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
      }

      withEmail(email) {
        this.email = email;
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
