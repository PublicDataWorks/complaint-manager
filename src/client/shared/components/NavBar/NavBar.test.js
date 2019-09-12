import React from "react";
import { mount } from "enzyme";
import NavBar from "./NavBar";
import { Backdrop } from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../../createConfiguredStore";
import { Provider } from "react-redux";
import { mockLocalStorage } from "../../../../mockLocalStorage";
import { containsText } from "../../../testHelpers";
import { userAuthSuccess } from "../../../auth/actionCreators";
import { disciplinaryProceedingsMenuOptions } from "./disciplinaryProceedingsMenuOptions";

describe("NavBar", () => {
  let wrapper, store;
  beforeEach(() => {
    mockLocalStorage();

    store = createConfiguredStore();
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <NavBar menuType={disciplinaryProceedingsMenuOptions} />
        </Router>
      </Provider>
    );
  });

  test("should contain a home icon button when showHome is true", () => {
    const homeButton = wrapper.find('[data-test="homeButton"]').last();

    homeButton.simulate("click");
    expect(homeButton.prop("href")).toEqual("/");
  });

  test("should not contain a home icon button when showHome is false", () => {
    wrapper.setProps({ children: <NavBar showHome={false} /> });
    wrapper.update();
    expect(wrapper.find('[data-test="homeButton"]').exists()).toBeFalse();
  });

  test("should display default nickname", () => {
    const nickname = wrapper.find('[data-test="userNickName"]').last();
    expect(nickname.text()).toEqual("");
  });

  describe("gear menu", () => {
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

    test("should render export menu option without permissions", () => {
      const userInfo = {
        nickname: "whatever",
        permissions: []
      };

      store.dispatch(userAuthSuccess(userInfo));
      wrapper.update();

      const gearButton = wrapper.find('[data-test="gearButton"]').last();
      gearButton.simulate("click");

      const exportAuditLogMenuItem = wrapper
        .find('[data-test="exports"]')
        .last();
      expect(exportAuditLogMenuItem.exists()).toBeTruthy();
    });
  });
});
