import React from "react";
import Civilian from "../../testUtilities/civilian";
import { mount } from "enzyme";
import DisplayComplainant from "./DisplayComplainant";
import CaseOfficer from "../../testUtilities/caseOfficer";
import Officer from "../../testUtilities/Officer";
import { COMPLAINANT } from "../../../sharedUtilities/constants";

test("displays the complainant when complainant is civilian", () => {
  const firstName = "Sal";
  const lastName = "Ariza";

  const civilian = new Civilian.Builder()
    .withFullName(`${firstName} ${lastName}`)
    .withRoleOnCase(COMPLAINANT)
    .build();

  const wrapper = mount(
    <DisplayComplainant caseDetails={{ complainantCivilians: [civilian] }} />
  );

  expect(wrapper.text()).toEqual(firstName + " " + lastName);
});

test("displays complainant if the complainant is an officer", () => {
  const officerFullName = "TEST_OFFICER_COMPLAINANT_NAME";
  const expectedDisplayName = "Officer " + officerFullName;

  const complainantOfficer = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withRoleOnCase(COMPLAINANT)
    .withOfficerAttributes(
      new Officer.Builder()
        .defaultOfficer()
        .withFullName(officerFullName)
        .build()
    )
    .build();

  const wrapper = mount(
    <DisplayComplainant
      caseDetails={{
        complainantCivilians: [],
        complainantOfficers: [complainantOfficer]
      }}
    />
  );

  expect(wrapper.text()).toEqual(expectedDisplayName);
});

test("displays complainant if the complainant is an officer and is unknown", () => {
  const expectedDisplayName = "Unknown Officer";

  const complainantOfficer = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withRoleOnCase(COMPLAINANT)
    .withUnknownOfficer()
    .build();

  const wrapper = mount(
    <DisplayComplainant
      caseDetails={{
        complainantCivilians: [],
        complainantOfficers: [complainantOfficer]
      }}
    />
  );

  expect(wrapper.text()).toEqual(expectedDisplayName);
});

test("displays an civilian complainant by default if civilian and officer complainants exist", () => {
  const complainantFullName = "TEST_CIVILIAN_NAME";
  const officerFullName = "TEST_OFFICER_COMPLAINANT_NAME";

  const complainantOfficer = new CaseOfficer.Builder()
    .defaultCaseOfficer()
    .withRoleOnCase(COMPLAINANT)
    .withOfficerAttributes(
      new Officer.Builder()
        .defaultOfficer()
        .withFullName(officerFullName)
        .build()
    )
    .build();

  const complainantCivilian = new Civilian.Builder()
    .withFullName(complainantFullName)
    .withRoleOnCase(COMPLAINANT)
    .build();

  const wrapper = mount(
    <DisplayComplainant
      caseDetails={{
        complainantCivilians: [complainantCivilian],
        complainantOfficers: [complainantOfficer]
      }}
    />
  );

  expect(wrapper.text()).toEqual(complainantFullName);
});

test("displays no complainant when no civilians exist", () => {
  const wrapper = mount(
    <DisplayComplainant caseDetails={{ complainantCivilians: [] }} />
  );

  expect(wrapper.text()).toEqual("No Complainants");
});
