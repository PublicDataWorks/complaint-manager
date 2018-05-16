import React from "react";
import { mount } from "enzyme";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { push } from "react-router-redux";
import { selectCaseOfficer } from "../../../actionCreators/officersActionCreators";
import CaseOfficer from "../../../testUtilities/caseOfficer";
import ManageOfficerMenu from "./ManageOfficerMenu";

describe("ManageOfficerMenu", () => {
  test("should select caseOfficer & when Edit Officer is clicked", () => {
    const caseOfficer = new CaseOfficer.Builder().defaultCaseOfficer().build();
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <ManageOfficerMenu caseOfficer={caseOfficer} />
        </Router>
      </Provider>
    );

    const manage = wrapper.find('[data-test="manageOfficer"]').last();
    manage.simulate("click");
    const editOfficer = wrapper.find('[data-test="editOfficer"]').last();
    editOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(selectCaseOfficer(caseOfficer));
    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/api/cases/${caseOfficer.caseId}/cases-officers/${caseOfficer.id}`)
    );
  });
});
