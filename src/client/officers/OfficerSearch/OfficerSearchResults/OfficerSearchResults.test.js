import React from "react";
import { mount } from "enzyme";
import ConnectedOfficerSearchResults from "./OfficerSearchResults";
import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import { searchOfficersSuccess } from "../../../actionCreators/officersActionCreators";
import { BrowserRouter as Router } from "react-router-dom";
import { searchSuccess } from "../../../actionCreators/searchActionCreators";

jest.mock("../../../cases/thunks/getCaseDetails", () => caseId => ({
  type: "MOCK_ACTION",
  caseId
}));

describe("OfficerSearchResults", () => {
  test("should initialize OfficerDetails form when select is clicked", () => {
    const store = createConfiguredStore();
    const anAccusedOfficer = {
      id: 34,
      notes: "bad person",
      roleOnCase: "Accused",
      officerId: 23
    };
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        accusedOfficers: [anAccusedOfficer],
        complainantOfficers: [],
        witnessOfficers: []
      })
    );

    store.dispatch(searchSuccess([{ firstName: "bob", id: 1 }]));
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <ConnectedOfficerSearchResults
            caseId={1}
            caseOfficerId={"34"}
            spinnerVisible={false}
            classes={{}}
            path={"/some/path"}
            initialize={{ type: "MOCK_TYPE" }}
          />
        </Router>
      </Provider>
    );

    const selectNewOfficerButton = wrapper
      .find('[data-test="selectNewOfficerButton"]')
      .first();
    selectNewOfficerButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith({ type: "MOCK_TYPE" });
  });
});
