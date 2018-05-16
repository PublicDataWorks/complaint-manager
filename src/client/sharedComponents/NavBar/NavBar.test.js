import React from "react";
import { mount } from "enzyme";
import NavBar from "./NavBar";
import { Backdrop } from "material-ui";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../createConfiguredStore";
import { Provider } from "react-redux";
import { mockLocalStorage } from "../../../mockLocalStorage";
import { containsText } from "../../../testHelpers";
import { userAuthSuccess } from "../../auth/actionCreators";
import { EXPORT_AUDIT_LOG } from "../../../sharedUtilities/constants";

describe("NavBar", () => {
  let wrapper, store;
  beforeEach(() => {
    mockLocalStorage();

    store = createConfiguredStore();
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <NavBar />
        </Router>
      </Provider>
    );
  });

  test("should contain a home icon button", () => {
    const homeButton = wrapper.find('[data-test="homeButton"]').last();

    homeButton.simulate("click");
    expect(homeButton.prop("href")).toEqual("/");
  });

  test("should contain a link named admin", () => {
    const gearButton = wrapper.find('button[data-test="gearButton"]');
    gearButton.simulate("click");

    const link = wrapper.find('a[data-test="adminButton"]');

    expect(link.prop("href")).toEqual("/admin");
  });

  test("should display default nickname", () => {
    const nickname = wrapper.find('[data-test="userNickName"]').last();
    expect(nickname.text()).toEqual("");
  });

  describe("gear menu", () => {
    test("should see admin button", () => {
      const gearButton = wrapper.find('button[data-test="gearButton"]');
      gearButton.simulate("click");

      const adminButton = wrapper.find('[data-test="adminButton"]');

      expect(adminButton.exists()).toBeTruthy();
    });

    test("should see log out button", () => {
      const gearButton = wrapper.find('button[data-test="gearButton"]');
      gearButton.simulate("click");

      const logOutButton = wrapper.find('[data-test="logOutButton"]');

      expect(logOutButton.exists()).toBeTruthy();
      containsText(logOutButton, '[data-test="logOutButton"]', "Log Out");
    });

    test("should dismiss menu when clicking away", () => {
      const gearButton = wrapper.find('[data-test="gearButton"]').last();
      gearButton.simulate("click");

      const backdrop = wrapper.find(Backdrop);
      backdrop.simulate("click");

      const menu = wrapper
        .find(NavBar)
        .find('[data-test="menu"]')
        .first();

      expect(menu.props()).toHaveProperty("open", false);
    });

    test("should open and close menu and see dialog box when click on Export System Log when have export permissions", () => {
      const userInfo = {
        nickname: "whatever",
        permissions: [EXPORT_AUDIT_LOG]
      };

      store.dispatch(userAuthSuccess(userInfo));
      wrapper.update();

      const gearButton = wrapper.find('[data-test="gearButton"]').last();
      gearButton.simulate("click");

      const exportAuditLogMenuItem = wrapper
        .find('[data-test="exportAuditLog"]')
        .last();
      exportAuditLogMenuItem.simulate("click");

      const menu = wrapper
        .find(NavBar)
        .find('[data-test="menu"]')
        .first();
      const exportConfirmationDialogText = wrapper
        .find('[data-test="exportAuditLogConfirmationText"]')
        .last();

      expect(menu.props()).toHaveProperty("open", false);
      expect(exportConfirmationDialogText.exists()).toBeTruthy();
    });

    test("should not render export system log menu option without permissions", () => {
      const userInfo = {
        nickname: "whatever",
        permissions: []
      };

      store.dispatch(userAuthSuccess(userInfo));
      wrapper.update();

      const gearButton = wrapper.find('[data-test="gearButton"]').last();
      gearButton.simulate("click");

      const exportAuditLogMenuItem = wrapper
        .find('[data-test="exportAuditLog"]')
        .last();
      expect(exportAuditLogMenuItem.exists()).toBeFalsy();
    });
  });
});
