import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { push } from "connected-react-router";
import { mount } from "enzyme";
import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import EditOfficerSearch from "./EditOfficerSearch";
import { CASE_STATUS } from "../../../sharedUtilities/constants";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import CaseOfficer from "../../testUtilities/caseOfficer";

jest.mock("../../cases/thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "InvalidCaseRedirect",
  caseId
}));

describe("EditOfficerSearch", () => {
  let caseId, dispatchSpy, store, wrapper, caseOfficer;
  beforeEach(() => {
    caseOfficer = new CaseOfficer.Builder().defaultCaseOfficer().build();
    caseId = "88";
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <EditOfficerSearch
            match={{
              params: { id: caseId, caseOfficerId: `${caseOfficer.id}` }
            }}
          />
        </Router>
      </Provider>
    );
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
