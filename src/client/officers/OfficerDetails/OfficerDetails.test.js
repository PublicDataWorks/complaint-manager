import { mount } from "enzyme/build/index";
import createConfiguredStore from "../../createConfiguredStore";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import OfficerDetails from "./OfficerDetails";
import { initialize } from "redux-form";
import { selectOfficer } from "../../actionCreators/officersActionCreators";
import { ACCUSED } from "../../../sharedUtilities/constants";

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
  const submitAction = jest.fn(values => ({ type: "MOCK_THUNK", values }));

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

  expect(dispatchSpy).toHaveBeenCalledWith(submitAction(expectedValues));
});

test('when adding officer to case, should disable submit button', () => {
  const mockOfficerSearchUrl = "/mock-officer-search-url";
  const caseId = 12;
  const submitAction = jest.fn(values => ({ type: "MOCK_THUNK", values }));

  const store = createConfiguredStore();

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

  expect(submitButton.is('[disabled=true]')).toBeTruthy()
})
