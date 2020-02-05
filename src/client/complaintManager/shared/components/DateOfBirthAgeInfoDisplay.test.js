import React from "react";
import { mount } from "enzyme";
import DateOfBirthAgeInfoDisplay from "./DateOfBirthAgeInfoDisplay";
import { containsText } from "../../../testHelpers";
import Civilian from "../../testUtilities/civilian";
import formatDate from "../../utilities/formatDate";
import calculateAgeBasedOnIncidentDate from "../../utilities/calculateAgeBasedOnIncidentDate";
import Officer from "../../testUtilities/Officer";
import CaseOfficer from "../../testUtilities/caseOfficer";

describe("DateOfBirthAgeInfoDisplay", () => {
  test("displays date of birth and age for civilian with birthdate", () => {
    const civilian = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate("1990-01-01")
      .build();

    const incidentDate = "2010-01-01";

    const age = calculateAgeBasedOnIncidentDate(civilian, incidentDate);

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(civilian.birthDate)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(
      birthDateInfoWrapper,
      '[data-testid="test"]',
      "Jan 1, 1990 (20)"
    );
  });

  test("displays N/A for civilian without birthdate", () => {
    const civilian = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate(undefined)
      .build();

    const incidentDate = "2010-01-01";

    const age = calculateAgeBasedOnIncidentDate(civilian, incidentDate);

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(civilian.birthDate)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(birthDateInfoWrapper, '[data-testid="test"]', "N/A");
  });

  test("displays date of birth but no age for civilian without incident date", () => {
    const civilian = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate("1990-01-01")
      .build();

    const incidentDate = null;

    const age = calculateAgeBasedOnIncidentDate(civilian, incidentDate);

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(civilian.birthDate)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(
      birthDateInfoWrapper,
      '[data-testid="test"]',
      "Jan 1, 1990 (N/A)"
    );
  });

  test("displays date of birth and age for case officer with birthdate", () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .withDOB("1990-01-01")
      .build();

    const accusedOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes)
      .build();

    const incidentDate = "2010-01-01";

    const age = calculateAgeBasedOnIncidentDate(
      accusedOfficerAttributes,
      incidentDate
    );

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(accusedOfficerAttributes.dob)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(
      birthDateInfoWrapper,
      '[data-testid="test"]',
      "Jan 1, 1990 (20)"
    );
  });

  test("displays N/A for case officer with no birthdate", () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .withDOB(undefined)
      .build();

    const accusedOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes(officerAttributes)
      .build();

    const incidentDate = "2010-01-01";

    const age = calculateAgeBasedOnIncidentDate(
      accusedOfficerAttributes,
      incidentDate
    );

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(accusedOfficerAttributes.dob)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(birthDateInfoWrapper, '[data-testid="test"]', "N/A");
  });

  test("displays date of birth but no age for officer without incident date", () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .withDOB("1990-01-01")
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

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(accusedOfficerAttributes.dob)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(
      birthDateInfoWrapper,
      '[data-testid="test"]',
      "Jan 1, 1990 (N/A)"
    );
  });

  test("displays N/A for civilian without incident date or birthdate", () => {
    const civilian = new Civilian.Builder()
      .defaultCivilian()
      .withBirthDate("1990-01-01")
      .build();

    const incidentDate = null;

    const age = calculateAgeBasedOnIncidentDate(civilian, incidentDate);

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(civilian.dob)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(birthDateInfoWrapper, '[data-testid="test"]', "N/A");
  });

  test("displays N/A for officer without incident date or birthdate", () => {
    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .withDOB("1990-01-01")
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

    const birthDateInfoWrapper = mount(
      <DateOfBirthAgeInfoDisplay
        birthDate={formatDate(accusedOfficerAttributes.dob)}
        age={age}
        testLabel={"test"}
        displayLabel={"TEST LABEL"}
      />
    );

    containsText(birthDateInfoWrapper, '[data-testid="test"]', "N/A");
  });
});
