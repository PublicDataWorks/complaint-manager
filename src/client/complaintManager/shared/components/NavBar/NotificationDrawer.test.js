import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBar from "./NavBar";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { matrixManagerMenuOptions } from "./matrixManagerMenuOptions";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import { wait } from "@testing-library/dom";
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
    return wrapper;
  }

  test("should open notification drawer when clicking bell icon and close drawer when clicking on navBar", async () => {
    //ARRANGE
    const { getByTestId, getByText, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");
    const headerUserName = getByTestId("userNickName");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await wait(() => {
      expect(getByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ACT -- close drawer by clicking on header
    fireEvent.click(headerUserName);

    // ASSERT -- drawer is closed
    await wait(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).not.toBeInTheDocument();
    });
  });

  test("should open notification drawer when clicking bell icon and close drawer when clicking on backdrop", async () => {
    //ARRANGE
    const { getByTestId, getByText, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await wait(() => {
      expect(getByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ACT -- close drawer by clicking on backdrop
    fireEvent.click(document.body);

    // ASSERT -- drawer is closed
    await wait(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).not.toBeInTheDocument();
    });
  });

  test("should open notification drawer when clicking bell icon and close drawer when clicking on bell", async () => {
    //ARRANGE
    const { getByTestId, getByText, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await wait(() => {
      expect(getByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ACT -- close drawer by clicking on bell
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is closed
    await wait(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).not.toBeInTheDocument();
    });
  });

  test("should open notification drawer when clicking bell icon and stay open when clicking on itself", async () => {
    //ARRANGE
    const { getByTestId, getByText, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await wait(() => {
      expect(getByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ARRANGE
    const notificationDrawer = getByTestId("notificationDrawer");

    // ACT -- close drawer by clicking on bell
    fireEvent.click(notificationDrawer);

    // ASSERT -- drawer is still open
    await wait(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });
  });
});
