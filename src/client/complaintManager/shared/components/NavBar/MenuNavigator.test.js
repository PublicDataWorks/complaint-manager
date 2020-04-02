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

  describe("complaint manager menu options", () => {
    let wrapper;

    test(
      "if menuType is complaintManagerMenuOptions and data visualization feature toggle is enabled, " +
        "menu items should be Archived Cases, Export, Data Dashboard, and Logout",
      () => {
        wrapper = mount(
          <Router>
            <MenuNavigator
              menuType={complaintManagerMenuOptions}
              featureToggles={{ dataVisualizationFeature: true }}
            />
          </Router>
        );

        expect(
          wrapper.find('[data-testid="archivedCases"]').exists()
        ).toBeTrue();
        expect(wrapper.find('[data-testid="exports"]').exists()).toBeTrue();
        expect(
          wrapper.find('[data-testid="logOutButton"]').exists()
        ).toBeTrue();
        expect(wrapper.find('[data-testid="complaints"]').exists()).toBeFalse();
        expect(
          wrapper.find('[data-testid="dataDashboard"]').exists()
        ).toBeTrue();
      }
    );

    test(
      "if menuType is complaintManagerMenuOptions and data visualization feature toggle is disabled, " +
        "menu items should be Archived Cases, Export, and Logout",
      () => {
        wrapper = mount(
          <Router>
            <MenuNavigator
              menuType={complaintManagerMenuOptions}
              featureToggles={{ dataVisualizationFeature: false }}
            />
          </Router>
        );

        expect(
          wrapper.find('[data-testid="archivedCases"]').exists()
        ).toBeTrue();
        expect(wrapper.find('[data-testid="exports"]').exists()).toBeTrue();
        expect(
          wrapper.find('[data-testid="logOutButton"]').exists()
        ).toBeTrue();
        expect(wrapper.find('[data-testid="complaints"]').exists()).toBeFalse();
        expect(
          wrapper.find('[data-testid="dataDashboard"]').exists()
        ).toBeFalse();
      }
    );
  });
});
