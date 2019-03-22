import React from "react";
import Civilian from "../../testUtilities/civilian";
import { mount } from "enzyme";
import DisplayComplainant from "./DisplayComplainant";
import CaseOfficer from "../../testUtilities/caseOfficer";
import Officer from "../../testUtilities/Officer";
import { COMPLAINANT, PERSON_TYPE } from "../../../sharedUtilities/constants";

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
