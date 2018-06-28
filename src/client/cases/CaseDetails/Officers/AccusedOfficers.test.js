import { mount } from "enzyme";
import AccusedOfficers from "./AccusedOfficers";
import React from "react";
import Officer from "../../../testUtilities/Officer";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import * as _ from "lodash";

describe("AccusedOfficers", function() {
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
        <AccusedOfficers accusedOfficers={accusedOfficers} />
      </Provider>
    );

    const officersDisplayed = wrapper.find('[data-test="officerPanel"]');
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
        <AccusedOfficers accusedOfficers={accusedOfficers} />
      </Provider>
    );

    const officersDisplayed = wrapper.find('[data-test="unknownOfficerPanel"]');
    const firstOfficer = officersDisplayed.first();

    expect(firstOfficer.text()).toContain("Unknown Officer");
  });
});
