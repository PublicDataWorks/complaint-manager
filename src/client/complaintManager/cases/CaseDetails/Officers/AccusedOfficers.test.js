import { mount } from "enzyme";
import Accused from "./Accused";
import React from "react";
import Officer from "../../../../../sharedTestHelpers/Officer";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";

describe("Accused", function () {
  test("should display officers", () => {
    const anOfficer = new Officer.Builder()
      .defaultOfficer()
      .withFullName("Jerry Springfield")
      .build();
    const accusedOfficers = [
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerAttributes(anOfficer)
        .build()
    ];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Accused accusedOfficers={accusedOfficers} />
      </Provider>
    );

    const officersDisplayed = wrapper.find('[data-testid="knownOfficerPanel"]');
    const firstOfficer = officersDisplayed.first();

    expect(firstOfficer.text()).toContain(anOfficer.fullName);
  });

  test("should display unknown officers", () => {
    const accusedOfficers = [
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withUnknownOfficer()
        .withFullName("Unknown Officer")
        .build()
    ];

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <Accused accusedOfficers={accusedOfficers} />
      </Provider>
    );

    const officersDisplayed = wrapper.find(
      '[data-testid="unknownOfficerPanel"]'
    );
    const firstOfficer = officersDisplayed.first();

    expect(firstOfficer.text()).toContain("Unknown Officer");
  });
});
