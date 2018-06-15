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

  test("officers should be sorted by createdAt ascending", () => {
    const accusedOfficer1 = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(1)
      .withFullName("Accused Officer 1")
      .withCreatedAt(new Date("2018-06-01"))
      .build();

    const accusedOfficer2 = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(2)
      .withFullName("Accused Officer 2")
      .withCreatedAt(new Date("2018-06-02"))
      .build();

    const wrapper = mount(
      <Provider store={createConfiguredStore()}>
        <AccusedOfficers accusedOfficers={[accusedOfficer2, accusedOfficer1]} />
      </Provider>
    );

    const officerNames = wrapper.find('[data-test="OfficerFullName"]');
    const uniqueOfficerNamesRendered = _.uniq(
      officerNames.map(officer => officer.text())
    );
    expect(uniqueOfficerNamesRendered).toEqual([
      "Accused Officer 1",
      "Accused Officer 2"
    ]);
  });
});
