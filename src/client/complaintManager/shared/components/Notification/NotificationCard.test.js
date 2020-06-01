import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import React from "react";
import { wait } from "@testing-library/dom";
import "@testing-library/jest-dom";
import NotificationCard from "./NotificationCard";
import createConfiguredStore from "../../../../createConfiguredStore";

describe("notification card", () => {
  let wrapper;
  const store = createConfiguredStore();

  const renderNotificationList = notification => {
    const handleNotificationCardClick = jest.fn();

    wrapper = render(
      <Provider store={store}>
        <Router>
          <NotificationCard
            notification={notification}
            key={notification.id}
            handleNotificationCardClick={handleNotificationCardClick}
          />
        </Router>
      </Provider>
    );
    return wrapper;
  };

  test("should render unread notifs with red dot", async () => {
    const readNotification = {
      user: "veronicablackwell@tw.com",
      updatedAt: "2020-03-19T18:57:31.953Z",
      caseReference: "AC2020-0004",
      author: { name: "Syd B", email: "sydbotz@tw.com" },
      caseNoteId: 8,
      id: 1,
      caseId: 4,
      hasBeenRead: false
    };
    const { queryByTestId } = renderNotificationList(readNotification);

    await wait(() => {
      expect(queryByTestId("unreadDot")).toBeInTheDocument();
    });
  });

  test("should render read notifs with no red dot", async () => {
    const unreadNotification = {
      user: "veronicablackwell@tw.com",
      updatedAt: "2020-03-19T18:57:31.953Z",
      caseReference: "AC2020-0004",
      author: { name: "Syd B", email: "sydbotz@tw.com" },
      caseNoteId: 8,
      id: 1,
      caseId: 4,
      hasBeenRead: true
    };
    const { queryByTestId } = renderNotificationList(unreadNotification);

    await wait(() => {
      expect(queryByTestId("unreadDot")).not.toBeInTheDocument();
    });
  });
});
