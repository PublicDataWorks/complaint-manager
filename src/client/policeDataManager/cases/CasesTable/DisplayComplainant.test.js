import React from "react";
import Civilian from "../../../../sharedTestHelpers/civilian";
import { mount } from "enzyme";
import DisplayComplainant from "./DisplayComplainant";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import { COMPLAINANT } from "../../../../sharedUtilities/constants";

const { PERSON_TYPE } = require(`${process.env.INSTANCE_FILES_DIR}/constants`);

test("displays the complainant when complainant is civilian", () => {
  const firstName = "Sal";
  const lastName = "Ariza";

  const civilian = new Civilian.Builder()
    .withFullName(`${firstName} ${lastName}`)
    .withRoleOnCase(COMPLAINANT)
    .build();

  const wrapper = mount(<DisplayComplainant complainant={civilian} />);

  expect(wrapper.text()).toEqual(firstName + " " + lastName);
});

test("displays the complainant when complainant is civilian AND anonymous", () => {
  const firstName = "Sal";
  const lastName = "Ariza";

  const civilian = new Civilian.Builder()
    .withFullName(`${firstName} ${lastName}`)
    .withIsAnonymous(true)
    .withRoleOnCase(COMPLAINANT)
    .build();

  const wrapper = mount(<DisplayComplainant complainant={civilian} />);

  expect(wrapper.text()).toEqual("(AC) " + firstName + " " + lastName);
});

test("displays complainant if the complainant is an officer", () => {
  const officerFullName = "TEST_OFFICER_COMPLAINANT_NAME";
  const expectedDisplayName = "Officer " + officerFullName;

  const complainantOfficer = {
    fullName: officerFullName,
    personType: PERSON_TYPE.KNOWN_OFFICER
  };

  const wrapper = mount(
    <DisplayComplainant complainant={complainantOfficer} />
  );

  expect(wrapper.text()).toEqual(expectedDisplayName);
});

test("displays complainant if the complainant is an officer AND anonymous", () => {
  const officerFullName = "TEST_OFFICER_COMPLAINANT_NAME";
  const expectedDisplayName = "(AC) Officer " + officerFullName;

  const complainantOfficer = {
    fullName: officerFullName,
    personType: PERSON_TYPE.KNOWN_OFFICER,
    isAnonymous: true
  };

  const wrapper = mount(
    <DisplayComplainant complainant={complainantOfficer} />
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
    <DisplayComplainant complainant={complainantOfficer} />
  );

  expect(wrapper.text()).toEqual(expectedDisplayName);
});

test("displays no complainant when no civilians exist", () => {
  const wrapper = mount(
    <DisplayComplainant caseDetails={{ complainantCivilians: [] }} />
  );

  expect(wrapper.text()).toEqual("No Complainants");
});
