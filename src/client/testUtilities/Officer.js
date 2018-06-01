class Officer {
  constructor(build) {
    this.id = build.id;
    this.officerNumber = build.officerNumber;
    this.fullName = build.fullName;
    this.firstName = build.firstName;
    this.middleName = build.middleName;
    this.lastName = build.lastName;
    this.rank = build.rank;
    this.race = build.race;
    this.gender = build.gender;
    this.dob = build.dob;
    this.bureau = build.bureau;
    this.district = build.district;
    this.workStatus = build.workStatus;
    this.supervisorOfficerNumber = build.supervisorOfficerNumber;
    this.hireDate = build.hireDate;
    this.endDate = build.endDate;
    this.windowsUsername = build.windowsUsername;
    this.employeeType = build.employeeType;
  }

  static get Builder() {
    class Builder {
      defaultOfficer() {
        this.id = 57;
        this.officerNumber = 200;
        this.fullName = "Ugochi Grant Smith";
        this.firstName = "Ugochi";
        this.middleName = "Grant";
        this.lastName = "Smith";
        this.rank = "Police Commander";
        this.race = "Cuban";
        this.gender = "Female";
        this.dob = "1990-04-30";
        this.bureau = "FOB - Field Operations Bureau";
        this.district = "First District";
        this.workStatus = "Active";
        this.supervisorOfficerNumber = null;
        this.hireDate = "2008-04-30";
        this.endDate = "2009-04-30";
        this.employeeType = "Commissioned";
        this.windowsUsername = 3241;
        return this;
      }

      withId(id) {
        this.id = id;
        return this;
      }

      withOfficerNumber(officerNumber) {
        this.officerNumber = officerNumber;
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

      withMiddleName(middleName) {
        this.middleName = middleName;
        return this;
      }

      withLastName(lastName) {
        this.lastName = lastName;
        return this;
      }

      withDistrict(district) {
        this.district = district;
        return this;
      }

      withWorkStatus(status) {
        this.workStatus = status;
        return this;
      }

      withSupervisor(officer) {
        this.supervisorOfficerNumber = officer.officerNumber;
        return this;
      }

      withWindowsUsername(windowsUsername) {
        this.windowsUsername = windowsUsername;
        return this;
      }

      withHireDate(hireDate) {
        this.hireDate = hireDate;
        return this;
      }

      withEndDate(endDate) {
        this.endDate = endDate;
        return this;
      }

      withEmployeeType(employeeType) {
        this.employeeType = employeeType;
        return this;
      }
      build() {
        return new Officer(this);
      }
    }

    return Builder;
  }
}

export default Officer;
