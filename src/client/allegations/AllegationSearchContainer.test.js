import React from "react";
import AllegationSearchContainer from "./AllegationSearchContainer";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import createConfiguredStore from "../createConfiguredStore";
import Case from "../testUtilities/case";
import CaseOfficer from "../testUtilities/caseOfficer";
import Officer from "../testUtilities/Officer";
import { getCaseDetailsSuccess } from "../actionCreators/casesActionCreators";
import { Table } from "material-ui";
import getCaseDetails from "../cases/thunks/getCaseDetails";

jest.mock("../cases/thunks/getCaseDetails", () => caseId => ({
  type: "MOCK_ACTION",
  caseId
}));

let store, officer, seededCase, caseOfficer, dispatchSpy;

beforeEach(() => {
  store = createConfiguredStore();

  dispatchSpy = jest.spyOn(store, "dispatch");

  const caseId = 47;
  const caseOfficerId = 100;
  const officerId = 101;

  officer = new Officer.Builder()
    .defaultOfficer()
    .withId(officerId)
    .build();
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

  const caseIdThatDoesNotMatchStore = 100;

  mount(
    <Provider store={store}>
      <Router>
        <AllegationSearchContainer
          match={{
            params: {
              id: caseIdThatDoesNotMatchStore,
              caseOfficerId: caseOfficer.id
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

  mount(
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

  expect(dispatchSpy).not.toHaveBeenCalledWith(getCaseDetails(seededCase.id));
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

  expect(wrapper.find("[data-test='pageTitle']").exists()).toBeFalsy();
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

  expect(wrapper.find('[data-test="officerFullName"]').text()).toEqual(
    officer.fullName
  );
});
