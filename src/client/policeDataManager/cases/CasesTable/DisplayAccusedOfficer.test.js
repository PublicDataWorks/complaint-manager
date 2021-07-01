import DisplayAccusedOfficer from "./DisplayAccusedOfficer";
import React from "react";
import { mount } from "enzyme";
import { containsText } from "../../../testHelpers";
import { PERSON_TYPE } from "../../../../instance-files/constants";

describe("DisplayAccusedOfficer", () => {
  const noAccusedDisplayText = "No Accused";

  test("should display an accused officer", () => {
    const accusedOfficer = {
      fullName: "fullName",
      personType: PERSON_TYPE.KNOWN_OFFICER
    };

    const wrapper = mount(
      <DisplayAccusedOfficer accusedOfficers={[accusedOfficer]} />
    );

    containsText(
      wrapper,
      '[data-testid="accusedOfficerName"]',
      accusedOfficer.fullName
    );
  });

  test("should be blank when no accused officers", () => {
    const wrapper = mount(<DisplayAccusedOfficer accusedOfficers={[]} />);

    const nameDisplay = wrapper.find('div[data-testid="accusedOfficerName"]');
    expect(nameDisplay.text()).toEqual(noAccusedDisplayText);
  });

  test("should be blank when accused officers is null", () => {
    const wrapper = mount(<DisplayAccusedOfficer accusedOfficers={null} />);

    const nameDisplay = wrapper.find('div[data-testid="accusedOfficerName"]');
    expect(nameDisplay.text()).toEqual(noAccusedDisplayText);
  });
});
