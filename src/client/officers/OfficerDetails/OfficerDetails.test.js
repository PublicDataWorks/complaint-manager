import { mount } from "enzyme/build/index";
import createConfiguredStore from "../../createConfiguredStore";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import React from "react";
import OfficerDetails from "./OfficerDetails";
import addOfficer from "../thunks/addOfficer";

jest.mock("../thunks/addOfficer", () => (caseId, officerId, values) => ({
  type: "MOCK_ADD_OFFICER_ACTION",
  caseId,
  officerId,
  values
}));

test("should dispatch thunk with correct stuff when unknown officer selected", () => {
  const mockOfficerSearchUrl = "/mock-officer-search-url";
  const expectedValues = { roleOnCase: "Accused" };

  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");
  const submitAction = jest.fn(values => ({ type: "MOCK_THUNK", values }));

  const caseId = 12;

  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          submitButtonText={"Button"}
          submitAction={submitAction}
          officerSearchUrl={mockOfficerSearchUrl}
          selectedOfficerData={null}
          caseId={caseId}
        />
      </Router>
    </Provider>
  );

  const submitButton = wrapper.find('button[data-test="officerSubmitButton"]');

  submitButton.simulate("click");

  expect(dispatchSpy).toHaveBeenCalledWith(submitAction(expectedValues));
});
