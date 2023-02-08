import React from "react";
import { mount } from "enzyme";
import { MemoryRouter as Router, Route } from "react-router-dom";
import ConnectedOfficerDetailsContainer from "./OfficerDetailsContainer";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import {
  clearCaseEmployeeType,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import { push } from "connected-react-router";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import {
  ACCUSED,
  CONFIGS,
  GET_CONFIGS_SUCCEEDED,
  OFFICER_TITLE
} from "../../../../sharedUtilities/constants";

jest.mock("../../cases/thunks/getCaseDetails");

describe("OfficerDetailsContainer", () => {
  let store, dispatchSpy;
  getCaseDetails.mockImplementation(() => ({ type: "mock" }));
  const caseId = 1;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
  });

  test("should clear selected officer and caseEmployeeType when Back to Case is clicked", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: 1,
        accusedOfficers: [
          {
            id: 23,
            roleOnCase: ACCUSED,
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
            caseId={caseId}
            titleAction={"Test"}
            submitButtonText={"Test Officer"}
            submitAction={jest.fn()}
            officerSearchUrl={`/test-search`}
          />
        </Router>
      </Provider>
    );

    const backToCaseButton = officerDashboard
      .find('[data-testid="back-to-case-link"]')
      .last();
    backToCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(clearSelectedOfficer());
    expect(dispatchSpy).toHaveBeenCalledWith(clearCaseEmployeeType());
  });

  test("should redirect and show error if no officer currently selected", () => {
    const caseId = 100;

    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        accusedOfficers: [
          {
            id: 23,
            roleOnCase: ACCUSED,
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
            component={props => (
              <ConnectedOfficerDetailsContainer
                submitAction={jest.fn()}
                caseId={caseId}
                titleAction={"Test"}
                submitButtonText={"Test Officer"}
                officerSearchUrl={`/cases/${caseId}/officers/search`}
                {...props}
              />
            )}
          />
        </Router>
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      push(`/cases/${caseId}/officers/search`)
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      snackbarError("Please select an employee or unknown officer to continue")
    );
  });

  test("should show employee when caseEmployee type is civilian within PD", () => {
    store.dispatch({
      type: GET_CONFIGS_SUCCEEDED,
      payload: { [CONFIGS.PD]: "Lettuce" }
    });

    const officerDashboard = mount(
      <Provider store={store}>
        <Router>
          <ConnectedOfficerDetailsContainer
            match={{
              params: {
                id: `${caseId}`
              }
            }}
            caseId={caseId}
            titleAction={"Test"}
            submitButtonText={"Test Employee"}
            submitAction={jest.fn()}
            officerSearchUrl={`/test-search`}
            caseEmployeeType={"Civilian Within PD"}
          />
        </Router>
      </Provider>
    );
    const pageTitle = officerDashboard
      .find('[data-testid="pageTitle"]')
      .last()
      .text();

    expect(pageTitle).toEqual(expect.stringContaining("Civilian (Lettuce)"));
    expect(pageTitle).toEqual(expect.not.stringContaining(OFFICER_TITLE));
  });
});
