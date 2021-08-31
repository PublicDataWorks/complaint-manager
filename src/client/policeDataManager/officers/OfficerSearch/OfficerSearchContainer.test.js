import React from "react";
import { mount, shallow } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import ConnectedDashboard, {
  OfficerSearchContainer
} from "./OfficerSearchContainer";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import {
  addCaseEmployeeType,
  clearSelectedOfficer
} from "../../actionCreators/officersActionCreators";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import Officer from "../../../../sharedTestHelpers/Officer";
import Case from "../../../../sharedTestHelpers/case";
import { searchSuccess } from "../../actionCreators/searchActionCreators";
import { ACCUSED } from "../../../../sharedUtilities/constants";

const {
  EMPLOYEE_TYPE
} = require(`${process.env.INSTANCE_FILES_DIR}/constants`);

jest.mock("../../cases/thunks/getCaseDetails");

describe("OfficerSearchContainer", () => {
  let mockDispatch = jest.fn();
  getCaseDetails.mockImplementation(() => ({ type: "mock" }));
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
        titleAction={"Test"}
        submitButtonText={"Test"}
        submitAction={jest.fn()}
        officerSearchUrl={`/test-search`}
      />
    );

    expect(mockDispatch).not.toHaveBeenCalledWith(getCaseDetails());
  });

  test("should navigate to edit when selecting to replace existing officer with unknown", () => {
    const store = createConfiguredStore();
    store.dispatch(addCaseEmployeeType(EMPLOYEE_TYPE.OFFICER));

    const path = "/";
    const officerDashboard = mount(
      <Provider store={store}>
        <Router>
          <ConnectedDashboard
            officerDetailsPath={path}
            submitAction={jest.fn(() => {
              type: "mock";
            })}
            titleAction={""}
          />
        </Router>
      </Provider>
    );

    const selectUnknown = officerDashboard
      .find('[data-testid="unknownOfficerButton"]')
      .first();
    expect(selectUnknown.prop("to")).toEqual(path);
  });

  test("should navigate to edit when selecting to replace current officer with a known officer", () => {
    const store = createConfiguredStore();

    const officer = new Officer.Builder()
      .defaultOfficer()
      .withId(234)
      .withFullName("Some Other Officer")
      .withOfficerNumber(456)
      .build();
    const caseDetails = new Case.Builder().defaultCase().build();

    store.dispatch(searchSuccess({ rows: [officer] }));
    store.dispatch(getCaseDetailsSuccess(caseDetails));

    const path = "/";
    const officerDashboard = mount(
      <Provider store={store}>
        <Router>
          <ConnectedDashboard
            officerDetailsPath={path}
            submitAction={jest.fn(() => {
              type: "mock";
            })}
            titleAction={""}
          />
        </Router>
      </Provider>
    );

    const selectNewOfficer = officerDashboard
      .find('[data-testid="selectNewOfficerButton"]')
      .first();
    expect(selectNewOfficer.prop("to")).toEqual(path);
  });

  test("should navigate to edit & initialize form when selecting to replace current officer with unknown officer", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const caseDetails = new Case.Builder().defaultCase().build();
    const caseId = caseDetails.id;
    const caseOfficerId = caseDetails.accusedOfficers[0].id;
    const path = "/";

    store.dispatch(getCaseDetailsSuccess(caseDetails));
    store.dispatch(addCaseEmployeeType(EMPLOYEE_TYPE.OFFICER));

    const officerDashboard = mount(
      <Provider store={store}>
        <Router>
          <ConnectedDashboard
            officerDetailsPath={path}
            submitAction={jest.fn(() => {
              type: "mock";
            })}
            titleAction={""}
            caseId={caseId}
            caseOfficerId={caseOfficerId}
            initialize={{ type: "MOCK_TYPE" }}
          />
        </Router>
      </Provider>
    );

    const selectUnknownOfficer = officerDashboard
      .find('[data-testid="unknownOfficerButton"]')
      .first();
    selectUnknownOfficer.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith({ type: "MOCK_TYPE" });
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
            roleOnCase: ACCUSED,
            officer: {
              id: 34
            }
          }
        ],
        complainantOfficers: [],
        witnessOfficers: []
      })
    );

    const path = "/";
    const officerDashboard = mount(
      <Provider store={store}>
        <Router>
          <ConnectedDashboard
            officerDetailsPath={path}
            submitAction={jest.fn(() => {
              type: "mock";
            })}
            titleAction={""}
          />
        </Router>
      </Provider>
    );

    const backToCaseButton = officerDashboard
      .find('[data-testid="back-to-case-link"]')
      .last();
    backToCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(clearSelectedOfficer());
  });
});
