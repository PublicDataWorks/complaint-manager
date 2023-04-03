import React from "react";
import { mount } from "enzyme";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { push } from "connected-react-router";
import {
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import ManageOfficerMenu from "./ManageOfficerMenu";
import { GET_CONFIGS_SUCCEEDED } from "../../../../../sharedUtilities/constants";

describe("ManageOfficerMenu", () => {
  let caseOfficer, dispatchSpy, wrapper;
  beforeEach(() => {
    caseOfficer = new CaseOfficer.Builder().defaultCaseOfficer().build();
    const store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <ManageOfficerMenu caseOfficer={caseOfficer} />
        </Router>
      </Provider>
    );

    const manage = wrapper.find('[data-testid="manageCaseOfficer"]').last();
    manage.simulate("click");
  });

  test("should select officer and redirect when edit known Officer is clicked", () => {
    const editOfficer = wrapper.find('[data-testid="editCaseOfficer"]').last();
    editOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(selectCaseOfficer(caseOfficer));
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
    );
  });

  test("should select officer and redirect when edit unknown Officer is clicked", () => {
    const caseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withOfficerAttributes({ fullName: "Unknown Officer" })
      .build();

    const store = createConfiguredStore();
    store.dispatch({
      type: GET_CONFIGS_SUCCEEDED,
      payload: { pd: "LVPD" }
    });

    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <ManageOfficerMenu caseOfficer={caseOfficer} />
        </Router>
      </Provider>
    );

    const manage = wrapper.find('[data-testid="manageCaseOfficer"]').last();

    manage.simulate("click");
    const editOfficer = wrapper.find('[data-testid="editCaseOfficer"]').last();

    editOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(selectUnknownOfficer());
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
    );
  });

  test("should open remove person dialog with officer details when remove officer is selected", () => {
    const removeOfficer = wrapper
      .find('[data-testid="removeCaseOfficer"]')
      .last();

    removeOfficer.simulate("click");

    expect(
      wrapper
        .find('[data-testid="confirmation-dialog-RemoveOfficer"]')
        .first()
        .text()
    ).toContain("Remove Officer");
  });
});
