import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import AddOfficerDetails from "./AddOfficerDetails";
import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { selectDropdownOption } from "../../testHelpers";
import { ACCUSED, CASE_STATUS } from "../../../sharedUtilities/constants";
import { getCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";
import invalidCaseStatusRedirect from "../../cases/thunks/invalidCaseStatusRedirect";
import getCaseDetails from "../../cases/thunks/getCaseDetails";

jest.mock("../../cases/thunks/invalidCaseStatusRedirect", () => caseId => ({
  type: "InvalidCaseRedirect",
  caseId
}));

jest.mock("../../cases/thunks/getCaseDetails", () => caseId => ({
  type: "GetCaseDetails",
  caseId
}));

describe("AddOfficerDetails", function() {
  const defaultMessage = "Role on Case";
  let caseId, dispatchSpy, store, wrapper;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    caseId = "5";

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <AddOfficerDetails match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("should set dropdown to default value when mounting add officer page", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );
    wrapper.update();
    const dropdown = wrapper.find('[data-test="roleOnCaseDropdown"]').first();
    expect(dropdown.text()).toContain(defaultMessage);
  });

  test("should set reset dropdown to default value when mounting add officer page, changing a value, remounting", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId
      })
    );
    wrapper.update();
    selectDropdownOption(wrapper, '[data-test="roleOnCaseDropdown"]', ACCUSED);
    wrapper.update();
    let dropdown = wrapper.find('div[data-test="roleOnCaseDropdownInput"]');

    expect(dropdown.prop("value")).toContain(ACCUSED);
    wrapper.unmount();
    wrapper.mount();
    dropdown = wrapper.find('[data-test="roleOnCaseDropdown"]').first();
    expect(dropdown.text()).toContain(defaultMessage);
  });

  test("dispatches getCaseDetails on mount", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(getCaseDetails(caseId));
  });

  test("redirects to case detail page if case is archived", () => {
    store.dispatch(
      getCaseDetailsSuccess({
        id: caseId,
        status: CASE_STATUS.LETTER_IN_PROGRESS,
        isArchived: true
      })
    );
    wrapper.update();
    expect(dispatchSpy).toHaveBeenCalledWith(invalidCaseStatusRedirect(caseId));
  });
});
