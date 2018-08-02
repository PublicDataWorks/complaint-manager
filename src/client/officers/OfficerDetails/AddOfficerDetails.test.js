import { mount } from "enzyme/build/index";
import { Provider } from "react-redux";
import { MemoryRouter as Router } from "react-router-dom";
import AddOfficerDetails from "./AddOfficerDetails";
import React from "react";
import createConfiguredStore from "../../createConfiguredStore";
import { selectDropdownOption } from "../../testHelpers";
import { ACCUSED } from "../../../sharedUtilities/constants";

describe("AddOfficerDetails", function() {
  const defaultMessage = "Role on Case";
  let wrapper;

  beforeEach(() => {
    const store = createConfiguredStore();
    const caseId = "5";

    wrapper = mount(
      <Provider store={store}>
        <Router>
          <AddOfficerDetails match={{ params: { id: caseId } }} />
        </Router>
      </Provider>
    );
  });

  test("should set dropdown to default value when mounting add officer page", () => {
    const dropdown = wrapper.find('[data-test="roleOnCaseDropdown"]').first();
    expect(dropdown.text()).toContain(defaultMessage);
  });

  test("should set reset dropdown to default value when mounting add officer page, changing a value, remounting", () => {
    let dropdown = wrapper.find('[data-test="roleOnCaseDropdown"]').first();
    selectDropdownOption(
      wrapper,
      '[data-test="roleOnCaseDropdownInput"]',
      ACCUSED
    );

    expect(dropdown.text()).toContain(ACCUSED);
    wrapper.unmount();
    wrapper.mount();
    dropdown = wrapper.find('[data-test="roleOnCaseDropdown"]').first();
    expect(dropdown.text()).toContain(defaultMessage);
  });
});
