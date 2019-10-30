import createConfiguredStore from "../../../createConfiguredStore";
import CaseOfficer from "../../testUtilities/caseOfficer";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import React from "react";
import EditOfficerDetails from "./EditOfficerDetails";
import getCaseDetails from "../../cases/thunks/getCaseDetails";

jest.mock("../../cases/thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "InvalidCaseRedirect",
  caseId
}));

jest.mock("../../cases/thunks/getCaseDetails", () => caseId => ({
  type: "GetCaseDetails",
  caseId
}));

describe("EditOfficerDetails", function() {
  let caseId, dispatchSpy, store, wrapper, caseOfficer;

  beforeEach(() => {
    caseOfficer = new CaseOfficer.Builder().defaultCaseOfficer().build();
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = "5";

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <EditOfficerDetails
            match={{
              params: { id: caseId, caseOfficerId: `${caseOfficer.id}` }
            }}
          />
        </Router>
      </Provider>
    );
  });

  test("dispatches getCaseDetails on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getCaseDetails(caseId));
  });

  test("redirects to case detail page if case is archived", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        isArchived: true,
        accusedOfficers: [],
        complainantOfficers: [caseOfficer],
        witnessOfficers: []
      })
    );
    wrapper.update();
    expect(dispatchSpy).toHaveBeenCalledWith(invalidCaseStatusRedirect(caseId));
  });
});
