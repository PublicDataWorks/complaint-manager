import { mount } from "enzyme/build/index";
import createConfiguredStore from "../../createConfiguredStore";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import OfficerDetails from "./OfficerDetails";
import { initialize } from "redux-form";
import { selectOfficer } from "../../actionCreators/officersActionCreators";
import { ACCUSED, COMPLAINANT } from "../../../sharedUtilities/constants";
import Officer from "../../testUtilities/Officer";

jest.mock("../thunks/addOfficer", () => (caseId, officerId, values) => ({
  type: "MOCK_ADD_OFFICER_ACTION",
  caseId,
  officerId,
  values
}));

test("should dispatch thunk with correct stuff when unknown officer selected", () => {
  const mockOfficerSearchUrl = "/mock-officer-search-url";
  const expectedValues = { roleOnCase: ACCUSED };
  const caseId = 12;
  const submitAction = jest.fn(id => values => ({
    type: "MOCK_THUNK",
    officer: { ...values, id }
  }));

  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");

  store.dispatch(initialize("OfficerDetails", { roleOnCase: ACCUSED }));
  store.dispatch(selectOfficer({}));

  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"Button"}
          submitAction={submitAction}
          officerSearchUrl={mockOfficerSearchUrl}
          caseId={caseId}
        />
      </Router>
    </Provider>
  );

  const submitButton = wrapper.find('button[data-test="officerSubmitButton"]');

  submitButton.simulate("click");

  expect(dispatchSpy).toHaveBeenCalledWith({
    type: "MOCK_THUNK",
    officer: expectedValues
  });
});

test("should populate role on case in search URL when officer is known", () => {
  const mockOfficerSearchUrl = "/mock-officer-search-url";
  const caseId = 12;
  const testOfficer = new Officer.Builder().defaultOfficer().build();
  const submitAction = jest.fn(id => values => ({
    type: "MOCK_THUNK",
    values,
    id
  }));

  const store = createConfiguredStore();

  store.dispatch(initialize("OfficerDetails", { roleOnCase: COMPLAINANT }));
  store.dispatch(selectOfficer(testOfficer));

  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"Button"}
          submitAction={submitAction}
          officerSearchUrl={mockOfficerSearchUrl}
          caseId={caseId}
        />
      </Router>
    </Provider>
  );

  const changeOfficer = wrapper
    .find('[data-test="knownOfficerChangeOfficerLink"]')
    .last();
  expect(changeOfficer.prop("officerSearchUrl")).toEqual(
    mockOfficerSearchUrl + "?role=Complainant"
  );
});

test("should populate role on case in search URL when officer is unknown", () => {
  const mockOfficerSearchUrl = "/mock-officer-search-url";
  const caseId = 12;
  const submitAction = jest.fn(id => values => ({
    type: "MOCK_THUNK",
    values,
    id
  }));

  const store = createConfiguredStore();

  store.dispatch(initialize("OfficerDetails", { roleOnCase: COMPLAINANT }));

  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"Button"}
          submitAction={submitAction}
          officerSearchUrl={mockOfficerSearchUrl}
          caseId={caseId}
        />
      </Router>
    </Provider>
  );

  const changeOfficer = wrapper
    .find('[data-test="unknownOfficerChangeOfficerLink"]')
    .last();
  expect(changeOfficer.prop("officerSearchUrl")).toEqual(
    mockOfficerSearchUrl + "?role=Complainant"
  );
});
