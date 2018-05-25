import React from "react";
import { mount, shallow } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import ConnectedDashboard, {
  OfficerSearchContainer
} from "./OfficerSearchContainer";
import getCaseDetails from "../../cases/thunks/getCaseDetails";
import {
  clearSelectedOfficer,
  searchOfficersSuccess
} from "../../actionCreators/officersActionCreators";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import Officer from "../../testUtilities/Officer";
import Case from "../../testUtilities/case";
import { searchSuccess } from "../../actionCreators/searchActionCreators";

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

    const selectUnkown = officerDashboard
      .find('[data-test="unknownOfficerButton"]')
      .first();
    expect(selectUnkown.prop("to")).toEqual(path);
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

    store.dispatch(searchSuccess([officer]));
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
      .find('[data-test="selectNewOfficerButton"]')
      .first();
    expect(selectNewOfficer.prop("to")).toEqual(path);
  });

  test("should navigate to edit & initialize form when selecting to replace current officer with unknown officer", () => {
    const store = createConfiguredStore();
    const dispatchSpy = jest.spyOn(store, "dispatch");

    const officer = new Officer.Builder()
      .defaultOfficer()
      .withId(234)
      .withFullName("Some Other Officer")
      .withOfficerNumber(456)
      .build();
    const caseDetails = new Case.Builder().defaultCase().build();
    const caseId = caseDetails.id;
    const caseOfficerId = caseDetails.accusedOfficers[0].id;
    const path = "/";

    store.dispatch(getCaseDetailsSuccess(caseDetails));

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
      .find('[data-test="unknownOfficerButton"]')
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
            roleOnCase: "Accused",
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
      .find('[data-test="back-to-case-link"]')
      .last();
    backToCaseButton.simulate("click");

    expect(dispatchSpy).toHaveBeenCalledWith(clearSelectedOfficer());
  });
});
