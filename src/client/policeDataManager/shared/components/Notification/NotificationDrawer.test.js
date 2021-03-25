import React from "react";
import { fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom";
import NavBar from "../NavBar/NavBar";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { waitFor } from "@testing-library/dom";
import { DEFAULT_NOTIFICATION_TEXT } from "../../../../../sharedUtilities/constants";
import { getNotificationsSuccess } from "../../../actionCreators/notificationActionCreators";
import MutationObserver from "@sheerun/mutationobserver-shim";
import { policeDataManagerMenuOptions } from "../NavBar/policeDataManagerMenuOptions";
window.MutationObserver = MutationObserver;

describe("notifications drawer", () => {
  const store = createConfiguredStore();
  function renderNavBar() {
    const wrapper = render(
      <Provider store={store}>
        <Router>
          <NavBar menuType={policeDataManagerMenuOptions} />
        </Router>
      </Provider>
    );
    return wrapper;
  }

  test("should open notification drawer when clicking bell icon and close drawer when clicking on navBar", async () => {
    //ARRANGE
    const { getByTestId, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");
    const header = getByTestId("header");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ACT -- close drawer by clicking on header
    fireEvent.click(header);

    // ASSERT -- drawer is closed
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).not.toBeInTheDocument();
    });
  });

  test("should open notification drawer when clicking bell icon and close drawer when clicking on backdrop", async () => {
    //ARRANGE
    const { getByTestId, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ACT -- close drawer by clicking on backdrop
    fireEvent.click(document.body);

    // ASSERT -- drawer is closed
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).not.toBeInTheDocument();
    });
  });

  test("should open notification drawer when clicking bell icon and close drawer when clicking on bell", async () => {
    //ARRANGE
    const { getByTestId, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ACT -- close drawer by clicking on bell
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is closed
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).not.toBeInTheDocument();
    });
  });

  test("should open notification drawer when clicking bell icon and stay open when clicking on itself", async () => {
    //ARRANGE
    const { getByTestId, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT -- drawer is open
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });

    // ARRANGE
    const notificationDrawer = getByTestId("notificationDrawer");

    // ACT -- close drawer by clicking on bell
    fireEvent.click(notificationDrawer);

    // ASSERT -- drawer is still open
    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).toBeInTheDocument();
    });
  });

  test("should show notification in notification drawer and no default notification text", async () => {
    //ARRANGE
    store.dispatch(
      getNotificationsSuccess([
        {
          user: "veronicablackwell@tw.com",
          updatedAt: "2019-11-29T19:31:41.953Z",
          caseReference: "CC2019-0018",
          author: { name: "", email: "" },
          id: 2
        }
      ])
    );

    const { getByTestId, queryByText } = renderNavBar();
    const notificationBell = getByTestId("notificationBell");

    // ACT -- open drawer
    fireEvent.click(notificationBell);

    // ASSERT
    await waitFor(() => {
      expect(queryByText("mentioned you in CC2019-0018")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(queryByText(DEFAULT_NOTIFICATION_TEXT)).not.toBeInTheDocument();
    });
  });
});
