import React from "react";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../../../createConfiguredStore";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import { containsText } from "../../../../testHelpers";
import { mockLocalStorage } from "../../../../../mockLocalStorage";
import NavBar from "./NavBar";
import { matrixManagerMenuOptions } from "./matrixManagerMenuOptions";

describe("notifications menu", () => {
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
    wrapper.setState({ notificationDrawer: false });

    store.dispatch(
      getFeaturesSuccess({
        notificationFeature: true
      })
    );
    wrapper.update();
  });

  test("should see notifications drawer when click on notification bell", () => {
    const notificationBell = wrapper
      .find('[data-test="notificationBell"]')
      .first();
    notificationBell.simulate("click");

    const notificationDrawer = wrapper
      .find('[data-test="notificationDrawer"]')
      .first();

    expect(notificationDrawer.props()).toHaveProperty("open", true);
    containsText(
      notificationDrawer,
      '[data-test="notificationDrawer"]',
      "You have no new notifications."
    );
  });

  test("should dismiss notification drawer when clicking outside of it", () => {
    const notificationBell = wrapper
      .find('[data-test="notificationBell"]')
      .first();
    notificationBell.simulate("click");

    const backdrop = wrapper.find("ForwardRef(Backdrop)");
    backdrop.simulate("click");

    const notificationDrawer = wrapper
      .find('[data-test="notificationDrawer"]')
      .first();

    expect(notificationDrawer.props()).toHaveProperty("open", false);
  });

  test("should dismiss already open notification drawer when clicking on notification bell", () => {
    const notificationBell = wrapper
      .find('[data-test="notificationBell"]')
      .first();
    notificationBell.simulate("click");

    notificationBell.simulate("click");

    const notificationDrawer = wrapper
      .find('[data-test="notificationDrawer"]')
      .first();

    expect(notificationDrawer.props()).toHaveProperty("open", false);
  });

  test("should keep notification drawer open when clicking on self", () => {
    const notificationBell = wrapper
      .find('[data-test="notificationBell"]')
      .first();
    notificationBell.simulate("click");

    const notificationDrawer = wrapper
      .find('[data-test="notificationDrawer"]')
      .first();
    notificationDrawer.simulate("click");

    expect(notificationDrawer.props()).toHaveProperty("open", true);
  });
});
