import React from "react";
import { mount } from "enzyme";
import { MemoryRouter as Router, Route } from "react-router-dom";
import ConnectedOfficerDetailsContainer, {
  OfficerDetailsContainer
} from "./OfficerDetailsContainer";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import { push } from "react-router-redux";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";
import { ACCUSED } from "../../../sharedUtilities/constants";

jest.mock("../../cases/thunks/getCaseDetails");

describe("OfficerDetailsContainer", () => {
  getCaseDetails.mockImplementation(() => ({ type: "mock" }));
  const caseId = 1;

  test("should clear selected officer when Back to Case is clicked", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");
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
      snackbarError("Please select an officer or unknown officer to continue")
    );
  });
});
