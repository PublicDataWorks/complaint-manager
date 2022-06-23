import React from "react";
import { mount } from "enzyme";
import MenuNavigator from "./MenuNavigator";
import { BrowserRouter as Router } from "react-router-dom";
import { policeDataManagerMenuOptions } from "./policeDataManagerMenuOptions";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { USER_PERMISSIONS } from "../../../../../sharedUtilities/constants";

describe("MenuNavigator", () => {
  describe("Complaint Manager menu options", () => {
    let wrapper;

    test(
      "if menuType is policeDataManagerMenuOptions and user does not have admin access " +
        "menu items should be Archived Cases, Export, Data Dashboard, and Logout",
      () => {
        wrapper = mount(
          <Provider store={createConfiguredStore()}>
            <Router>
              <MenuNavigator menuType={policeDataManagerMenuOptions} />
            </Router>
          </Provider>
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
        expect(wrapper.find('[data-testid="admin"]').exists()).toBeFalse();
      }
    );

    test(
      "if menuType is policeDataManagerMenuOptions and user has admin access " +
        "menu items should be Archived Cases, Export, Data Dashboard, and Logout",
      () => {
        const store = createConfiguredStore();
        store.dispatch({
          type: "AUTH_SUCCESS",
          userInfo: { permissions: [USER_PERMISSIONS.ADMIN_ACCESS] }
        });

        wrapper = mount(
          <Provider store={store}>
            <Router>
              <MenuNavigator menuType={policeDataManagerMenuOptions} />
            </Router>
          </Provider>
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
        expect(wrapper.find('[data-testid="admin"]').exists()).toBeTrue();
      }
    );
  });
});
