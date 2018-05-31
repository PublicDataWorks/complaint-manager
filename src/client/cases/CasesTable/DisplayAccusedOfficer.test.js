import DisplayAccusedOfficer from "./DisplayAccusedOfficer";
import React from "react";
import { mount } from "enzyme";
import CaseOfficer from "../../testUtilities/caseOfficer";
import { containsText } from "../../../testHelpers";

describe("DisplayAccusedOfficer", () => {
  const noAccusedDisplayText = "No Accused Officers";

  test("should display an accused officer", () => {
    const accusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .build();
    const accusedOfficers = [accusedOfficer];
    const wrapper = mount(
      <DisplayAccusedOfficer accusedOfficers={accusedOfficers} />
    );

    containsText(
      wrapper,
      '[data-test="accusedOfficerName"]',
      accusedOfficer.fullName
    );
  });

  test("should be blank when no accused officers", () => {
    const wrapper = mount(<DisplayAccusedOfficer accusedOfficers={[]} />);

    const nameDisplay = wrapper.find('div[data-test="accusedOfficerName"]');
    expect(nameDisplay.text()).toEqual(noAccusedDisplayText);
  });

  test("should be blank when accused officers is null", () => {
    const wrapper = mount(<DisplayAccusedOfficer accusedOfficers={null} />);

    const nameDisplay = wrapper.find('div[data-test="accusedOfficerName"]');
    expect(nameDisplay.text()).toEqual(noAccusedDisplayText);
  });

  test("should be blank when accused officer present but officer details are not", () => {
    const accusedOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withNoOfficer()
      .build();

    const wrapper = mount(
      <DisplayAccusedOfficer accusedOfficers={[accusedOfficer]} />
    );

    const nameDisplay = wrapper.find('div[data-test="accusedOfficerName"]');
    expect(nameDisplay.text()).toEqual(noAccusedDisplayText);
  });
});
