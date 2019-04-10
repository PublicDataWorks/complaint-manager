import CaseHistory from "./CaseHistory";
import React from "react";
import { getCaseHistorySuccess } from "../../../actionCreators/caseHistoryActionCreators";
import { getMinimumCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { mount } from "enzyme";
import getMinimumCaseDetails from "../../thunks/getMinimumCaseDetails";
import getCaseHistory from "../../thunks/getCaseHistory";
import createConfiguredStore from "../../../createConfiguredStore";

jest.mock("../../thunks/getCaseHistory", () =>
  jest.fn(() => ({
    type: "mockGetCaseHistoryThunk"
  }))
);

jest.mock("../../thunks/getMinimumCaseDetails", () =>
  jest.fn(() => ({
    type: "mockGetMinimumCaseDetailsThunk"
  }))
);

describe("CaseHistory", () => {
  test("it fetches the case history and case reference on mount", () => {
    const store = createConfiguredStore();
    store.dispatch(
      getCaseHistorySuccess([
        {
          id: 1,
          modelDescription: [],
          action: "action",
          user: "user",
          details: {},
          timestamp: new Date()
        }
      ])
    );
    store.dispatch(
      getMinimumCaseDetailsSuccess({
        caseReference: "reference",
        status: "status"
      })
    );

    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <CaseHistory match={{ params: { id: 5 } }} />
        </Router>
      </Provider>
    );
    expect(getCaseHistory).toHaveBeenCalledWith(5);
    expect(getMinimumCaseDetails).toHaveBeenCalledWith(5);
  });
});
