import React from "react";
import { mount, shallow } from "enzyme";
import { MemoryRouter as Router, Route } from "react-router-dom";
import ConnectedOfficerDetailsContainer, {
  OfficerDetailsContainer
} from "./OfficerDetailsContainer";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import { clearSelectedOfficer } from "../actionCreators/officersActionCreators";
import createConfiguredStore from "../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../actionCreators/casesActionCreators";
import { push } from "react-router-redux";
import { snackbarError } from "../actionCreators/snackBarActionCreators";

jest.mock("../cases/thunks/getCaseDetails");

describe("OfficerDetailsContainer", () => {
  let mockDispatch = jest.fn();
  getCaseDetails.mockImplementation(() => "");
  const caseId = 1;

  test("should not fetch case details when already loaded", () => {
    shallow(
      <OfficerDetailsContainer
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
      <OfficerDetailsContainer
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
      <OfficerDetailsContainer
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
        ]
      })
    );

    const officerDashboard = mount(
      <Provider store={store}>
        <Router>
          <ConnectedOfficerDetailsContainer
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

  test("should redirect and show error if no officer currently selected", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
    const caseId = 100;

    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        accusedOfficers: [
          {
            id: 23,
            roleOnCase: "Accused",
            officer: {
              id: 34
            }
          }
        ]
      })
    );

    mount(
      <Provider store={store}>
        <Router
          initialEntries={[`/cases/${caseId}/officers/details`]}
          initialIndex={0}
        >
          <Route
            path="/cases/:id/officers/details"
            component={props => <ConnectedOfficerDetailsContainer {...props} />}
          />
        </Router>
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseId}/officers/search`)
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      snackbarError("Please select an officer or unknown officer to continue")
    );
  });
});
