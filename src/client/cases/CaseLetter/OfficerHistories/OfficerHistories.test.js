import createConfiguredStore from "../../../createConfiguredStore";
import { getCaseDetailsSuccess } from "../../../actionCreators/casesActionCreators";
import { Provider } from "react-redux";
import OfficerHistories from "./OfficerHistories";
import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import { changeInput, containsText } from "../../../testHelpers";
jest.mock("../../../shared/components/RichTextEditor/RichTextEditor");

describe("OfficerHistories page", function() {
  let wrapper, store, caseId;
  beforeEach(() => {
    caseId = "4";
    const caseDetail = {
      id: caseId,
      accusedOfficers: [
        { fullName: "Officer 1", id: 0 },
        { fullName: "Officer 2", id: 1 },
        { fullName: "Officer 3", id: 2 }
      ]
    };

    store = createConfiguredStore();
    store.dispatch(getCaseDetailsSuccess(caseDetail));

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <OfficerHistories match={{ params: { id: caseId } }} />
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

  test("it calculates the number of total historical allegations entered", () => {
    changeInput(
      wrapper,
      "[name='officers[0].numberHistoricalHighAllegations']",
      "1"
    );
    changeInput(
      wrapper,
      "[name='officers[0].numberHistoricalMediumAllegations']",
      "2"
    );
    changeInput(
      wrapper,
      "[name='officers[0].numberHistoricalLowAllegations']",
      "3"
    );
    containsText(
      wrapper,
      `[data-test='officers-0-total-historical-allegations']`,
      "6 total allegations"
    );
  });

  test("it ignores invalid values when calculating the number of total historical allegations entered", () => {
    changeInput(
      wrapper,
      "[name='officers[0].numberHistoricalHighAllegations']",
      "abc"
    );
    changeInput(
      wrapper,
      "[name='officers[0].numberHistoricalMediumAllegations']",
      " "
    );
    changeInput(
      wrapper,
      "[name='officers[0].numberHistoricalLowAllegations']",
      2
    );
    containsText(
      wrapper,
      `[data-test='officers-0-total-historical-allegations']`,
      "2 total allegations"
    );
  });

  test("it should display message when no officers", () => {
    const caseDetailWithoutOfficers = {
      id: caseId,
      accusedOfficers: []
    };
    store.dispatch(getCaseDetailsSuccess(caseDetailWithoutOfficers));
    wrapper.update();
    containsText(
      wrapper,
      `[data-test='no-officers-message']`,
      "There are no officers on this case"
    );
  });
});
