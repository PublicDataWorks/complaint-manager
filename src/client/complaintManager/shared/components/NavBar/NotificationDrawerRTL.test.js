import React from "react";
import { fireEvent, render } from "@testing-library/react";
import NavBar from "./NavBar";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { matrixManagerMenuOptions } from "./matrixManagerMenuOptions";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import { queryByText, wait } from "@testing-library/dom";
import { DEFAULT_NOTIFICATION_TEXT } from "../../../../../sharedUtilities/constants";

describe("notifications menu", () => {
  function renderNavBar() {
    const store = createConfiguredStore();
    const wrapper = render(
      <Provider store={store}>
        <Router>
          <NavBar menuType={matrixManagerMenuOptions} />
        </Router>
      </Provider>
    );

    store.dispatch(
      getFeaturesSuccess({
        notificationFeature: true
      })
    );

    const { container, getByTestId, getByText } = wrapper;
    return { container, getByTestId, getByText };
  }

  test("should dismiss already open notification drawer when drawer state set to false", async () => {
    const { container, getByTestId, getByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");
    const gearButton = getByTestId("gearButton");
    const notificationDrawer = queryByText(
      container,
      DEFAULT_NOTIFICATION_TEXT
    );

    fireEvent.click(notificationBell);

    expect(getByText(DEFAULT_NOTIFICATION_TEXT)).toBeTruthy();

    fireEvent.click(gearButton);

    await wait(() => {
      expect(notificationDrawer).toBeNull();
    });
  });
});
