import React from "react";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import createConfiguredStore from "../../../createConfiguredStore";
import { push } from "react-router-redux";
import { Provider } from "react-redux";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import OfficerActions from "./OfficerActions";
import {
  selectOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";

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

    expect(dispatchSpy).toHaveBeenCalledWith(selectOfficer(caseOfficer));
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
    );
  });

  test("should select caseOfficer & navigate to edit page when unknown officer is clicked", () => {
    const caseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficer({ fullName: "Unknown Officer" })
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
});
