import React from "react";
import { mount } from "enzyme";
import AddOfficerSearch from "./AddOfficerSearch";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import getCaseDetails from "../../cases/thunks/getCaseDetails";

jest.mock("../../cases/thunks/getCaseDetails", () => caseId => ({
  type: "MOCK_ACTION",
  caseId
}));

describe("AddOfficerSearch", () => {
  test("should fetch case details when match params does not match current loaded case", () => {
    const store = createConfiguredStore();
    const mockDispatch = jest.spyOn(store, "dispatch");
    store.dispatch(getCaseDetailsSuccess({ id: 2 }));

    const newCaseId = "1";

    mount(
      <Provider store={store}>
        <Router>
          <AddOfficerSearch match={{ params: { id: newCaseId } }} />
        </Router>
      </Provider>
    );

    expect(mockDispatch).toHaveBeenCalledWith(getCaseDetails(newCaseId));
  });
});
