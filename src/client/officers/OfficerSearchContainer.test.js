import React from "react";
import { mount, shallow } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import ConnectedDashboard, {
  OfficerSearchContainer
} from "./OfficerSearchContainer";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import { clearSelectedOfficer } from "../actionCreators/officersActionCreators";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../actionCreators/casesActionCreators";

jest.mock("../cases/thunks/getCaseDetails");

describe("OfficerSearchContainer", () => {
  let mockDispatch = jest.fn();
  getCaseDetails.mockImplementation(() => "");
  const caseId = 1;

  test("should not fetch case details when already loaded", () => {
    shallow(
      <OfficerSearchContainer
        match={{
          params: {
            id: `${caseId}`
          }
        }}
        caseId={caseId}
        dispatch={mockDispatch}
      />
    );

    expect(mockDispatch).not.toHaveBeenCalledWith(getCaseDetails());
  });

  test("should fetch case details when different case is loaded", () => {
    const differentCaseId = 5;
    shallow(
      <OfficerSearchContainer
        match={{
          params: {
            id: `${caseId}`
          }
        }}
        caseId={differentCaseId}
        dispatch={mockDispatch}
      />
    );

    expect(mockDispatch).toHaveBeenCalledWith(getCaseDetails());
  });

  test("should fetch case details when no case is loaded", () => {
    const noCase = null;
    shallow(
      <OfficerSearchContainer
        match={{
          params: {
            id: `${caseId}`
          }
        }}
        caseId={noCase}
        dispatch={mockDispatch}
      />
    );

    expect(mockDispatch).toHaveBeenCalledWith(getCaseDetails());
  });

  test("should clear selected officer when Back to Case is clicked", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        accusedOfficers: [
          {
            id: 23,
            roleOnCase: "Accused",
            officer: {
              id: 34
            }
          }
        ],
        complainantWitnessOfficers: []
      })
    );

    const officerDashboard = mount(
      <Provider store={store}>
        <Router>
          <ConnectedDashboard
            match={{
              params: {
                id: `${caseId}`
              }
            }}
          />
        </Router>
      </Provider>
    );

    const backToCaseButton = officerDashboard
      .find('[data-test="back-to-case-link"]')
      .last();
    backToCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(clearSelectedOfficer());
  });
});
