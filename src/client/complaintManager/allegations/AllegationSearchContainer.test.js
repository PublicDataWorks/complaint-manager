import React from "react";
import AllegationSearchContainer from "./AllegationSearchContainer";
import { mount } from "enzyme";
import { MemoryRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import createConfiguredStore from "../../createConfiguredStore";
import Case from "../../../sharedTestHelpers/case";
import CaseOfficer from "../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../sharedTestHelpers/Officer";
import { getCaseDetailsSuccess } from "../actionCreators/casesActionCreators";
import { Table } from "@material-ui/core";
import getCaseDetails from "../cases/thunks/getCaseDetails";
import OfficerAllegations from "./OfficerAllegations";
import invalidCaseStatusRedirect from "../cases/thunks/invalidCaseStatusRedirect";

jest.mock("../cases/thunks/getCaseDetails", () => caseId => ({
  type: "MOCauditLogin.test.jsK_GET_CASE_DETAILS",
  caseId
}));

jest.mock("../cases/thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "INVALID_CASE_REDIRECT",
  caseId
}));

describe("AllegationSearchContainer", () => {
  let store, officer, seededCase, caseOfficer, dispatchSpy;

  beforeEach(() => {
    store = createConfiguredStore();

    dispatchSpy = jest.spyOn(store, "dispatch");

    const caseId = 47;
    const caseOfficerId = 100;
    const officerId = 101;

    officer = new Officer.Builder().defaultOfficer().withId(officerId).build();
    caseOfficer = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(caseOfficerId)
      .withCaseId(caseId)
      .withOfficerAttributes(officer)
      .build();
    seededCase = new Case.Builder()
      .defaultCase()
      .withId(caseId)
      .withAccusedOfficers([caseOfficer])
      .build();
  });

  test("should retrieve case details if not present in state", () => {
    store.dispatch(getCaseDetailsSuccess(seededCase));

    const caseIdThatDoesNotMatchStore = `100`;

    mount(
      <Provider store={store}>
        <Router>
          <AllegationSearchContainer
            match={{
              params: {
                id: caseIdThatDoesNotMatchStore,
                caseOfficerId: `${caseOfficer.id}`
              }
            }}
          />
        </Router>
      </Provider>
    );

    expect(dispatchSpy).toHaveBeenCalledWith(
      getCaseDetails(caseIdThatDoesNotMatchStore)
    );
  });

  test("should not retrieve case details if correct data already present in state", () => {
    store.dispatch(getCaseDetailsSuccess(seededCase));
    const caseId = `${seededCase.id}`;

    mount(
      <Provider store={store}>
        <Router>
          <AllegationSearchContainer
            match={{
              params: {
                id: caseId,
                caseOfficerId: `${caseOfficer.id}`
              }
            }}
          />
        </Router>
      </Provider>
    );

    expect(dispatchSpy).not.toHaveBeenCalledWith(getCaseDetails(caseId));
  });

  test("should not render when caseOfficerId in route doesn't exist for a case", () => {
    store.dispatch(getCaseDetailsSuccess(seededCase));

    const caseOfficerIdThatDoesNotExist = 500;

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <AllegationSearchContainer
            match={{
              params: {
                id: seededCase.id,
                caseOfficerId: caseOfficerIdThatDoesNotExist
              }
            }}
          />
        </Router>
      </Provider>
    );

    expect(wrapper.find("[data-testid='pageTitle']").exists()).toBeFalsy();
  });

  test("should show the correct accused officer when state matches route", () => {
    store.dispatch(getCaseDetailsSuccess(seededCase));

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <AllegationSearchContainer
            match={{
              params: {
                id: seededCase.id,
                caseOfficerId: caseOfficer.id
              }
            }}
          />
        </Router>
      </Provider>
    );
    expect(wrapper.find(Table).exists()).toBeTruthy();

    expect(wrapper.find('[data-testid="officerFullName"]').text()).toEqual(
      officer.fullName
    );
  });

  test("should redirect to case details page for archived case", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <AllegationSearchContainer
            match={{
              params: {
                id: `${seededCase.id}`,
                caseOfficerId: `${caseOfficer.id}`
              }
            }}
          />
        </Router>
      </Provider>
    );

    store.dispatch(
      getCaseDetailsSuccess({
        ...seededCase,
        isArchived: true
      })
    );

    wrapper.update();
    expect(dispatchSpy).toHaveBeenCalledWith(
      invalidCaseStatusRedirect(seededCase.id)
    );
  });

  test("should display case allegations for the officer", () => {
    caseOfficer.allegations = [
      {
        allegation: {
          id: 1,
          rule: "rule",
          paragraph: "paragraph",
          directive: "directive"
        },
        id: 2,
        caseOfficerId: 3
      }
    ];

    store.dispatch(getCaseDetailsSuccess(seededCase));

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <AllegationSearchContainer
            match={{
              params: {
                id: seededCase.id,
                caseOfficerId: caseOfficer.id
              }
            }}
          />
        </Router>
      </Provider>
    );
    expect(wrapper.find(OfficerAllegations).exists()).toBeTruthy();
  });
});
