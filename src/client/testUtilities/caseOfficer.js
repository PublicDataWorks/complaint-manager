class CaseOfficer {
  constructor(build) {
    this.id = build.id;
    this.caseId = build.caseId;
    this.officerId = build.officerId;
    this.notes = build.notes;
    this.roleOnCase = build.roleOnCase;
    this.fullName = build.fullName;
    this.firstName = build.firstName;
    this.middleName = build.middleName;
    this.lastName = build.lastName;
    this.supervisorFirstName = build.supervisorFirstName;
    this.supervisorMiddleName = build.supervisorMiddleName;
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
  }

  static get Builder() {
    class Builder {
      defaultCaseOfficer() {
        this.id = 23;
        this.caseId = 17;
        this.fullName = "Grant M. Young";
        this.firstName = "Grant";
        this.middleName = "M";
        this.lastName = "Young";
        this.supervisorFirstName = "Belly";
        this.supervisorMiddleName = "G";
        this.supervisorLastName = "Walsh";
        this.windowsUsername = 12;
        this.supervisorWindowsUsername = 14;
        this.supervisorOfficerNumber = 1;
        this.rank = "ADMIN SUPPORT SPECIALIST II";
        this.race = "Black";
        this.sex = "M";
        this.dob = "1986-02-23";
        this.bureau = "MSB - Management Service Bureau";
        this.district = "First District";
        this.workStatus = "Retired";
        this.hireDate = "2018-05-30";
        this.endDate = "2018-05-31";
        this.employeeType = "Commissioned";
        this.officerId = 123456;
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

      withNoOfficer() {
        this.firstName = null;
        this.middleName = null;
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
        this.fullName = null;
        return this;
      }

      withOfficer(officer) {
        this.firstName = officer.firstName;
        this.middleName = officer.middleName;
        this.lastName = officer.lastName;
        this.windowsUsername = officer.windowsUsername;
        this.rank = officer.rank;
        this.race = officer.race;
        this.sex = officer.sex;
        this.dob = officer.dob;
        this.bureau = officer.bureau;
        this.district = officer.district;
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
        this.supervisorMiddleName = null;
        this.supervisorLastName = null;
        this.supervisorWindowsUsername = null;
        this.supervisorOfficerNumber = null;

        return this;
      }

      withSupervisor(officer) {
        this.supervisorFirstName = officer.firstName;
        this.supervisorMiddleName = officer.middleName;
        this.supervisorLastName = officer.lastName;
        this.supervisorWindowsUsername = officer.windowsUsername;
        this.supervisorOfficerNumber = officer.officerNumber;
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
