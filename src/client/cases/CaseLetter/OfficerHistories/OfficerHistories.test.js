import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import OfficerHistories from "./OfficerHistories";
import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import { containsText } from "../../../testHelpers";

describe("OfficerHistories page", function() {
  let wrapper;
  beforeEach(() => {
    const caseId = "4";
    const caseDetail = {
      id: caseId,
      accusedOfficers: [
        { fullName: "Officer 1", id: 0 },
        { fullName: "Officer 2", id: 1 },
        { fullName: "Officer 3", id: 2 }
      ]
    };

    const store = createConfiguredStore();
    store.dispatch(getCaseDetailsSuccess(caseDetail));
    const dispatchSpy = jest.spyOn(store, "dispatch");

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerHistories
            match={{ params: { id: caseId } }}
            dispatch={dispatchSpy}
          />
        </Router>
      </Provider>
    );
  });

  test("it renders a tab header for each officer", () => {
    containsText(wrapper, "[data-test='tab-0']", "Officer 1");
    containsText(wrapper, "[data-test='tab-1']", "Officer 2");
    containsText(wrapper, "[data-test='tab-2']", "Officer 3");
  });

  test("it renders a tab content for the default selected officer", () => {
    containsText(wrapper, "[data-test='tab-content-0']", "Officer 1");
    expect(
      wrapper.find("[data-test='tab-content-0']").get(0).props.style
    ).toHaveProperty("display", "block");
    expect(
      wrapper.find("[data-test='tab-content-1']").get(0).props.style
    ).toHaveProperty("display", "none");
    expect(
      wrapper.find("[data-test='tab-content-2']").get(0).props.style
    ).toHaveProperty("display", "none");
  });

  test("it renders a tab content for the selected officer", () => {
    wrapper
      .find("[data-test='tab-1']")
      .first()
      .simulate("click");
    containsText(wrapper, "[data-test='tab-content-1']", "Officer 2");
    expect(
      wrapper.find("[data-test='tab-content-1']").get(0).props.style
    ).toHaveProperty("display", "block");
    expect(
      wrapper.find("[data-test='tab-content-0']").get(0).props.style
    ).toHaveProperty("display", "none");
    expect(
      wrapper.find("[data-test='tab-content-2']").get(0).props.style
    ).toHaveProperty("display", "none");
  });
});
