import React from "react";
import { mount } from "enzyme";
import { matrixManagerMenuOptions } from "./matrixManagerMenuOptions";
import MenuNavigator from "./MenuNavigator";
import { BrowserRouter as Router } from "react-router-dom";
import { complaintManagerMenuOptions } from "./complaintManagerMenuOptions";

describe("MenuNavigator", () => {
  test("if menuType is matrixManagerOptions, menu items should be Complaints,Export, and Logout", () => {
    const wrapper = mount(
      <Router>
        <MenuNavigator menuType={matrixManagerMenuOptions} />
      </Router>
    );

    expect(wrapper.find('[data-testid="complaints"]').exists()).toBeTrue();
    expect(wrapper.find('[data-testid="exports"]').exists()).toBeTrue();
    expect(wrapper.find('[data-testid="logOutButton"]').exists()).toBeTrue();
    expect(wrapper.find('[data-testid="archivedCases"]').exists()).toBeFalse();
  });

  test("if menuType is complaintManagerMenuOptions, menu items should be Archived Cases, Export, and Logout", () => {
    const wrapper = mount(
      <Router>
        <MenuNavigator menuType={complaintManagerMenuOptions} />
      </Router>
    );

    expect(wrapper.find('[data-testid="archivedCases"]').exists()).toBeTrue();
    expect(wrapper.find('[data-testid="exports"]').exists()).toBeTrue();
    expect(wrapper.find('[data-testid="logOutButton"]').exists()).toBeTrue();
    expect(wrapper.find('[data-testid="complaints"]').exists()).toBeFalse();
  });
});
