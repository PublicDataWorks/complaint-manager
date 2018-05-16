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
  const expectedValues = { roleOnCase: "Accused" };

  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");

  const caseId = 12;

  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails selectedOfficerData={null} caseId={caseId} />
      </Router>
    </Provider>
  );

  const submitButton = wrapper.find(
    'button[data-test="addOfficerSubmitButton"]'
  );

  submitButton.simulate("click");

  expect(dispatchSpy).toHaveBeenCalledWith(
    addOfficer(caseId, null, expectedValues)
  );
});

test("should dispatch thunk with correct stuff when known officer selected", () => {
  const expectedValues = { roleOnCase: "Accused" };

  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");
  const caseId = 12;
  const officerId = 30;

  const wrapper = mount(
    <Provider store={store}>
      <Router>
        <OfficerDetails
          selectedOfficerData={{
            knownOfficer: "bob",
            workStatus: "retired",
            id: officerId
          }}
          caseId={caseId}
        />
      </Router>
    </Provider>
  );

  const submitButton = wrapper.find(
    'button[data-test="addOfficerSubmitButton"]'
  );

  submitButton.simulate("click");

  expect(dispatchSpy).toHaveBeenCalledWith(
    addOfficer(caseId, officerId, expectedValues)
  );
});
