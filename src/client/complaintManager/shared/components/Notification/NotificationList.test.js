import createConfiguredStore from "../../../../createConfiguredStore";
import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import React from "react";
import NotificationList from "./NotificationList";
import { wait } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { getNotificationsSuccess } from "../../../actionCreators/notificationActionCreators";
import axios from "axios";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

jest.mock("axios");

describe("notification list", () => {
  const store = createConfiguredStore();
  const dispatchSpy = jest.spyOn(store, "dispatch");

  let responseBody = {
    data: { caseNoteExists: true, notificationExists: true }
  };
  let handleClickAway;
  let wrapper;

  const renderNotificationList = () => {
    handleClickAway = jest.fn();

    wrapper = render(
      <Provider store={store}>
        <Router>
          <NotificationList handleClickAway={handleClickAway} />
        </Router>
      </Provider>
    );

    axios.get.mockReturnValue({ ...responseBody });

    store.dispatch(
      getFeaturesSuccess({
        notificationFeature: true
      })
    );

    store.dispatch(
      getNotificationsSuccess([
        {
          user: "veronicablackwell@tw.com",
          updatedAt: "2020-03-19T18:57:31.953Z",
          caseReference: "AC2020-0004",
          author: { name: "Syd B", email: "sydbotz@tw.com" },
          caseNoteId: 8,
          id: 1,
          caseId: 4
        },
        {
          user: "veronicablackwell@tw.com",
          updatedAt: "2019-11-29T19:31:41.953Z",
          caseReference: "CC2019-0018",
          author: { name: "Wanchen Y", email: "wanchenyao@tw.com" },
          caseNoteId: 6,
          id: 2,
          caseId: 18
        },
        {
          user: "veronicablackwell@tw.com",
          updatedAt: "2019-11-29T19:31:41.953Z",
          caseReference: "CC2019-0030",
          author: { name: "Wanchen Y", email: "wanchenyao@tw.com" },
          caseNoteId: 3,
          id: 7,
          caseId: 20
        }
      ])
    );

    return wrapper;
  };

  const findAndClickNotif = notificationCardId => {
    const { getAllByTestId } = renderNotificationList();

    const notificationCard = getAllByTestId("notificationCard")[
      notificationCardId
    ];

    fireEvent.click(notificationCard);

    return notificationCard;
  };

  test("should render 3 notification cards if the user has 3 notifications", async () => {
    const { queryByText } = renderNotificationList();

    await wait(() => {
      expect(
        queryByText("Syd B mentioned you in AC2020-0004")
      ).toBeInTheDocument();
    });

    await wait(() => {
      expect(
        queryByText("Wanchen Y mentioned you in CC2019-0018")
      ).toBeInTheDocument();
    });

    await wait(() => {
      expect(
        queryByText("Wanchen Y mentioned you in CC2019-0030")
      ).toBeInTheDocument();
    });
  });

  test("notification card should reference correct case details link", async () => {
    findAndClickNotif(0);

    await wait(() => {
      expect(window.location.href).toEqual(`${window.location.origin}/cases/4`);
    });
  });

  test("should see red snackbar for when notification is deleted from case note", async () => {
    responseBody = {
      data: { caseNoteExists: true, notificationExists: false }
    };

    findAndClickNotif(1);

    await wait(() => {
      expect(handleClickAway).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        snackbarError(
          "The case note for this notification no longer mentions you"
        )
      );
    });
  });

  test("should see red snackbar for when case note is removed", async () => {
    responseBody = {
      data: { caseNoteExists: false, notificationExists: false }
    };

    findAndClickNotif(1);

    await wait(() => {
      expect(handleClickAway).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        snackbarError(
          "The case note for this notification has been removed from the complaint"
        )
      );
    });
  });

  test("should make axios get request to get notification status endpoint", async () => {
    findAndClickNotif(1);

    await wait(() => {
      expect(axios.get).toHaveBeenCalledWith(`/api/notifications/6/2`);
    });
  });

  test("should make axios get request to mark notification as read when clicking on notif", async () => {
    findAndClickNotif(1);

    await wait(() => {
      expect(axios.get).toHaveBeenCalledWith(
        `/api/notifications/mark-as-read/2`
      );
    });
  });

  test("drawer should close when user clicks on notification and is already on notification's case details page", async () => {
    responseBody = {
      data: { caseNoteExists: true, notificationExists: true }
    };

    const notificationCard = findAndClickNotif(2);

    fireEvent.click(notificationCard);

    await wait(() => {
      expect(handleClickAway).toHaveBeenCalledTimes(1);
    });
  });
});
