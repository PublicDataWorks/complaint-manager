import React from "react";
import { mount } from "enzyme";
import MenuNavigator from "./MenuNavigator";
import { BrowserRouter as Router } from "react-router-dom";
import { policeDataManagerMenuOptions } from "./policeDataManagerMenuOptions";

describe("MenuNavigator", () => {
  describe("police data manager menu options", () => {
    let wrapper;

    test(
      "if menuType is policeDataManagerMenuOptions and data visualization feature toggle is enabled, " +
        "menu items should be Archived Cases, Export, Data Dashboard, and Logout",
      () => {
        wrapper = mount(
          <Router>
            <MenuNavigator menuType={policeDataManagerMenuOptions} />
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
        expect(
          wrapper.find('[data-testid="tagManagement"]').exists()
        ).toBeTrue();
      }
    );
  });
});
