import React from "react";
import { mount } from "enzyme";
import NavBar from "./NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { mockLocalStorage } from "../../../../../mockLocalStorage";
import { containsText } from "../../../../testHelpers";
import { userAuthSuccess } from "../../../../common/auth/actionCreators";
import { matrixManagerMenuOptions } from "./matrixManagerMenuOptions";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";

describe("NavBar", () => {
  let wrapper, store;
  beforeEach(() => {
    mockLocalStorage();

    store = createConfiguredStore();
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <NavBar menuType={matrixManagerMenuOptions} />
        </Router>
      </Provider>
    );
  });

  test("should contain a home icon button when showHome is true", () => {
    const homeButton = wrapper.find('[data-testid="homeButton"]').last();

    homeButton.simulate("click");
    expect(homeButton.prop("href")).toEqual("/");
  });

  test("should not contain a home icon button when showHome is false", () => {
    wrapper.setProps({ children: <NavBar showHome={false} /> });
    wrapper.update();
    expect(wrapper.find('[data-testid="homeButton"]').exists()).toBeFalse();
  });

  test("should display default nickname", () => {
    const nickname = wrapper.find('[data-testid="userNickName"]').last();
    expect(nickname.text()).toEqual("");
  });

  describe("gear menu", () => {
    test("should see log out button", () => {
      const gearButton = wrapper.find('button[data-testid="gearButton"]');
      gearButton.simulate("click");

      const logOutButton = wrapper.find('[data-testid="logOutButton"]');

      expect(logOutButton.exists()).toBeTruthy();
      containsText(logOutButton, '[data-testid="logOutButton"]', "Log Out");
    });

    test("should dismiss menu when clicking away", () => {
      const gearButton = wrapper.find('[data-testid="gearButton"]').last();
      gearButton.simulate("click");

      const backdrop = wrapper.find("ForwardRef(SimpleBackdrop)");
      backdrop.simulate("click");

      const menu = wrapper
        .find(NavBar)
        .find('[data-testid="menu"]')
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

      const gearButton = wrapper.find('[data-testid="gearButton"]').last();
      gearButton.simulate("click");

      const exportAuditLogMenuItem = wrapper
        .find('[data-testid="exports"]')
        .last();
      expect(exportAuditLogMenuItem.exists()).toBeTruthy();
    });
  });

  describe("Notifications Feature Toggle", () => {
    test("displays notification bell when toggled on", () => {
      store.dispatch(
        getFeaturesSuccess({
          notificationFeature: true
        })
      );
      wrapper.update();
      expect(
        wrapper.find('[data-testid="notificationBell"]').exists()
      ).toBeTrue();
    });

    test("does not display notification bell when toggled off", () => {
      store.dispatch(
        getFeaturesSuccess({
          notificationFeature: false
        })
      );
      wrapper.update();
      expect(
        wrapper.find('[data-testid="notificationBell"]').exists()
      ).toBeFalse();
    });
  });
});
