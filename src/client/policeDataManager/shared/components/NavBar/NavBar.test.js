import React from "react";
import { mount } from "enzyme";
import NavBar from "./NavBar";
import { BrowserRouter as Router } from "react-router-dom";
import createConfiguredStore from "../../../../createConfiguredStore";
import { Provider } from "react-redux";
import { mockLocalStorage } from "../../../../../mockLocalStorage";
import { authEnabledTest, containsText } from "../../../../testHelpers";
import { userAuthSuccess } from "../../../../common/auth/actionCreators";
import getNotificationsForUser from "../../thunks/getNotificationsForUser";
import { getNotificationsSuccess } from "../../../actionCreators/notificationActionCreators";
import { policeDataManagerMenuOptions } from "./policeDataManagerMenuOptions";

jest.mock("../../thunks/getNotificationsForUser", () => values => ({
  type: "MOCK_THUNK",
  values
}));

describe("NavBar", () => {
  let wrapper, store, dispatchSpy;

  beforeEach(() => {
    mockLocalStorage();

    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <NavBar menuType={policeDataManagerMenuOptions} />
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
    wrapper.setProps({
      children: (
        <NavBar menuType={policeDataManagerMenuOptions} showHome={false} />
      )
    });
    wrapper.update();
    expect(wrapper.find('[data-testid="homeButton"]').exists()).toBeFalse();
  });

  describe("hamburger menu", () => {
    test("should see log out button", () => {
      authEnabledTest(() => {
        const hamburgerButton = wrapper.find(
          'button[data-testid="hamburgerButton"]'
        );
        hamburgerButton.simulate("click");

        const logOutButton = wrapper.find('[data-testid="logOutButton"]');

        expect(logOutButton.exists()).toBeTruthy();
        containsText(logOutButton, '[data-testid="logOutButton"]', "Log Out");
      });
    });

    test("should dismiss menu when clicking away", () => {
      const hamburgerButton = wrapper
        .find('[data-testid="hamburgerButton"]')
        .last();
      hamburgerButton.simulate("click");

      const backdrop = wrapper.find("ForwardRef(SimpleBackdrop)");
      backdrop.simulate("click");

      const menu = wrapper.find(NavBar).find('[data-testid="menu"]').first();

      expect(menu.props()).toHaveProperty("open", false);
    });

    test("should render export menu option without permissions", () => {
      const userInfo = {
        nickname: "whatever",
        permissions: []
      };

      store.dispatch(userAuthSuccess(userInfo));
      wrapper.update();

      const hamburgerButton = wrapper
        .find('[data-testid="hamburgerButton"]')
        .last();
      hamburgerButton.simulate("click");

      const exportAuditLogMenuItem = wrapper
        .find('[data-testid="exports"]')
        .last();
      expect(exportAuditLogMenuItem.exists()).toBeTruthy();
    });
  });

  describe("notification bell", () => {
    test("displays notification bell", () => {
      expect(
        wrapper.find('[data-testid="notificationBell"]').exists()
      ).toBeTrue();
    });

    test("getNotifications should be dispatched when bell is clicked to open drawer ONLY", () => {
      wrapper.update();
      const notificationBell = wrapper
        .find('[data-testid="notificationBell"]')
        .first();

      notificationBell.simulate("click");

      expect(dispatchSpy).toHaveBeenCalledWith(getNotificationsForUser(""));

      dispatchSpy.mockClear();
      notificationBell.simulate("click");

      expect(dispatchSpy).not.toHaveBeenCalledWith(getNotificationsForUser(""));
    });

    test("should display badge icon on notification bell when user with 0 unread notifications receives 1 new notification", () => {
      let notificationBadge = wrapper.find("ForwardRef(Badge)");
      expect(notificationBadge.props().badgeContent).toBe(0);

      store.dispatch(
        getNotificationsSuccess([
          {
            user: "veronicablackwell@tw.com",
            updatedAt: "2020-03-19T18:57:31.953Z",
            caseReference: "AC2020-0004",
            author: { name: "Syd B", email: "sydbotz@tw.com" },
            caseNoteId: 8,
            id: 0,
            caseId: 4
          }
        ])
      );
      wrapper.update();
      notificationBadge = wrapper.find("ForwardRef(Badge)");

      expect(notificationBadge.props()).toHaveProperty("badgeContent", 1);
    });

    test("should not display badge icon on notification bell when user has read all notifications", () => {
      store.dispatch(
        getNotificationsSuccess([
          {
            user: "veronicablackwell@tw.com",
            updatedAt: "2020-03-19T18:57:31.953Z",
            caseReference: "AC2020-0004",
            author: { name: "Syd B", email: "sydbotz@tw.com" },
            caseNoteId: 8,
            id: 0,
            caseId: 4
          }
        ])
      );
      wrapper.update();
      let notificationBadge = wrapper.find("ForwardRef(Badge)");

      expect(notificationBadge.props()).toHaveProperty("badgeContent", 1);

      store.dispatch(
        getNotificationsSuccess([
          {
            user: "veronicablackwell@tw.com",
            updatedAt: "2020-03-19T18:57:31.953Z",
            caseReference: "AC2020-0004",
            author: { name: "Syd B", email: "sydbotz@tw.com" },
            caseNoteId: 8,
            id: 0,
            caseId: 4,
            hasBeenRead: true
          }
        ])
      );

      wrapper.update();

      notificationBadge = wrapper.find("ForwardRef(Badge)");

      expect(notificationBadge.props()).toHaveProperty("badgeContent", 0);
    });
  });
});
