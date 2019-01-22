import React from "react";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import createConfiguredStore from "../../../createConfiguredStore";
import { push } from "react-router-redux";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import OfficerActions from "./OfficerActions";
import {
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import { openRemovePersonDialog } from "../../../actionCreators/casesActionCreators";

describe("OfficerActions", () => {
  test("should select caseOfficer & navigate to edit page when Edit Known Officer is clicked", () => {
    const caseOfficer = new CaseOfficer.Builder().defaultCaseOfficer().build();
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerActions caseOfficer={caseOfficer} />
        </Router>
      </Provider>
    );

    const editOfficer = wrapper.find('[data-test="editOfficerLink"]').last();
    editOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(selectCaseOfficer(caseOfficer));
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
    );
  });

  test("should select caseOfficer & navigate to edit page when unknown officer is clicked", () => {
    const caseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes({ fullName: "Unknown Officer" })
      .build();

    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerActions caseOfficer={caseOfficer} />
        </Router>
      </Provider>
    );

    const editOfficer = wrapper.find('[data-test="editOfficerLink"]').last();
    editOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(selectUnknownOfficer());
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
    );
  });

  test("should remove officer from the complaintants list", () => {
    const caseOfficer = new CaseOfficer.Builder().defaultCaseOfficer().build();

    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerActions caseOfficer={caseOfficer} />
        </Router>
      </Provider>
    );

    const removeOfficer = wrapper
      .find('[data-test="removeOfficerLink"]')
      .last();
    removeOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openRemovePersonDialog(caseOfficer, "cases-officers")
    );
  });
});
