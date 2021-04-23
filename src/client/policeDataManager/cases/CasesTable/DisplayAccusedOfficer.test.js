import DisplayAccusedOfficer from "./DisplayAccusedOfficer";
import React from "react";
import { mount } from "enzyme";
import { containsText } from "../../../testHelpers";
import { PERSON_TYPE } from "../../../../instance-files/constants";

describe("DisplayAccusedOfficer", () => {
  const noAccusedDisplayText = "No Accused Officers";

  test("should display an accused officer", () => {
    const accusedOfficer = {
      fullName: "fullName",
      personType: PERSON_TYPE.KNOWN_OFFICER
    };

    const wrapper = mount(
      <DisplayAccusedOfficer primaryAccusedOfficer={accusedOfficer} />
    );

    containsText(
      wrapper,
      '[data-testid="primaryAccusedOfficerName"]',
      accusedOfficer.fullName
    );
  });

  test("should be blank when no accused officers", () => {
    const wrapper = mount(<DisplayAccusedOfficer accusedOfficers={[]} />);

    const nameDisplay = wrapper.find(
      'div[data-testid="primaryAccusedOfficerName"]'
    );
    expect(nameDisplay.text()).toEqual(noAccusedDisplayText);
  });

  test("should be blank when accused officers is null", () => {
    const wrapper = mount(<DisplayAccusedOfficer accusedOfficers={null} />);

    const nameDisplay = wrapper.find(
      'div[data-testid="primaryAccusedOfficerName"]'
    );
    expect(nameDisplay.text()).toEqual(noAccusedDisplayText);
  });
});
