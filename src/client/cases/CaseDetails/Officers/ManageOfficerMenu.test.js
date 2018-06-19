import React from "react";
import { mount } from "enzyme";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { push } from "react-router-redux";
import {
  selectCaseOfficer,
  selectUnknownOfficer
} from "../../../actionCreators/officersActionCreators";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import ManageOfficerMenu from "./ManageOfficerMenu";
import { openRemovePersonDialog } from "../../../actionCreators/casesActionCreators";

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

    const manage = wrapper.find('[data-test="manageCaseOfficer"]').last();
    manage.simulate("click");
  });

  test("should select officer and redirect when edit known Officer is clicked", () => {
    const editOfficer = wrapper.find('[data-test="editCaseOfficer"]').last();
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
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <ManageOfficerMenu caseOfficer={caseOfficer} />
        </Router>
      </Provider>
    );

    const manage = wrapper.find('[data-test="manageCaseOfficer"]').last();

    manage.simulate("click");
    const editOfficer = wrapper.find('[data-test="editCaseOfficer"]').last();

    editOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(selectUnknownOfficer());
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseOfficer.caseId}/officers/${caseOfficer.id}`)
    );
  });

  test("should open remove person dialog with officer details when remove officer is selected", () => {
    const removeOfficer = wrapper
      .find('[data-test="removeCaseOfficer"]')
      .last();

    removeOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(
      openRemovePersonDialog(caseOfficer, "cases-officers")
    );
  });
});
