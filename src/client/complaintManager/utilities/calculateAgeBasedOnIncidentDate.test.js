import calculateAgeBasedOnIncidentDate from "./calculateAgeBasedOnIncidentDate";
import Officer from "../testUtilities/Officer";
import CaseOfficer from "../testUtilities/caseOfficer";
import Civilian from "../testUtilities/civilian";

describe("calculateAgeBasedOnIncidentDate", function() {
  test("should return null if no incident date for officer", () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .build();

    const accusedOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes)
      .build();

    const incidentDate = null;

    const age = calculateAgeBasedOnIncidentDate(
      accusedOfficerAttributes,
      incidentDate
    );

    expect(age).toEqual("N/A");
  });

  test("should return null if no incident date for civilian", () => {
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate("1994-04-24")
      .build();

    const incidentDate = null;

    const age = calculateAgeBasedOnIncidentDate(
      civilianAttributes,
      incidentDate
    );

    expect(age).toEqual("N/A");
  });

  test("should return correct age if there is an incident date for officer", () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .withDOB("1970-01-01")
      .build();

    const accusedOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes)
      .build();

    const incidentDate = "2000-01-01";

    const age = calculateAgeBasedOnIncidentDate(
      accusedOfficerAttributes,
      incidentDate
    );

    expect(age).toEqual(30);
  });

  test("should return correct age if there is an incident date for civilian", () => {
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate("1970-01-01")
      .build();

    const incidentDate = "2000-01-01";

    const age = calculateAgeBasedOnIncidentDate(
      civilianAttributes,
      incidentDate
    );

    expect(age).toEqual(30);
  });

  test("returns null when no birthdate for civilian", () => {
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate(undefined)
      .build();

    const incidentDate = "2000-01-01";

    const age = calculateAgeBasedOnIncidentDate(
      civilianAttributes,
      incidentDate
    );

    expect(age).toEqual(null);
  });

  test("returns null when no birthdate for case officer", () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .withDOB(undefined)
      .build();

    const accusedOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes)
      .build();

    const incidentDate = "2000-01-01";

    const age = calculateAgeBasedOnIncidentDate(
      accusedOfficerAttributes,
      incidentDate
    );

    expect(age).toEqual(null);
  });
});
