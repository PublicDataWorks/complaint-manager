import React from "react";
import { mount } from "enzyme";
import AddOfficerSearch from "./AddOfficerSearch";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";

jest.mock("../../cases/thunks/getCaseDetails", () => caseId => ({
  type: "GET_CASE_DETAILS",
  caseId
}));

jest.mock("../../cases/thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "INVALID_CASE_REDIRECT",
  caseId
}));

describe("AddOfficerSearch", () => {
  let store, mockDispatch;
  beforeEach(() => {
    store = createConfiguredStore();
    mockDispatch = jest.spyOn(store, "dispatch");
  });
  test("should fetch case details when match params does not match current loaded case", () => {
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

  test("should clear selected officer on mount", () => {
    store.dispatch(getCaseDetailsSuccess({ id: 2 }));

    const newCaseId = "1";

    mount(
      <Provider store={store}>
        <Router>
          <AddOfficerSearch match={{ params: { id: newCaseId } }} />
        </Router>
      </Provider>
    );
    expect(mockDispatch).toHaveBeenCalledWith(clearSelectedOfficer());
  });
  test("should redirect to case details page for archived case", () => {
    const caseId = 2;
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <AddOfficerSearch match={{ params: { id: `${caseId}` } }} />
        </Router>
      </Provider>
    );
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        isArchived: true
      })
    );

    wrapper.update();
    expect(mockDispatch).toHaveBeenCalledWith(
      invalidCaseStatusRedirect(caseId)
    );
  });
});
