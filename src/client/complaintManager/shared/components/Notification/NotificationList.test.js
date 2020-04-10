import createConfiguredStore from "../../../../createConfiguredStore";
import { fireEvent, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { getFeaturesSuccess } from "../../../actionCreators/featureTogglesActionCreators";
import React from "react";
import NotificationList from "./NotificationList";
import { wait } from "@testing-library/dom";
import "@testing-library/jest-dom";
import { getUsersSuccess } from "../../../../common/actionCreators/usersActionCreators";
import { getNotificationsSuccess } from "../../../actionCreators/notificationActionCreators";
import getUsers from "../../../../common/thunks/getUsers";
import getCaseDetails from "../../../cases/thunks/getCaseDetails";
import axios from "axios";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

jest.mock("../../../../common/thunks/getUsers", () => values => ({
  type: "MOCK_THUNK",
  values
}));

jest.mock("../../../cases/thunks/getCaseDetails", () => caseId => ({
  type: "MOCK_THUNK",
  caseId
}));

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
      getUsersSuccess([
        { email: "veronicablackwel@tw.com", name: "Veronica B" },
        { email: "sydbotz@tw.com", name: "Syd B" },
        { email: "wanchenyao@tw.com", name: "Wanchen Y" }
      ])
    );

    store.dispatch(
      getNotificationsSuccess([
        {
          user: "veronicablackwell@tw.com",
          updatedAt: "2020-03-19T18:57:31.953Z",
          caseReference: "AC2020-0004",
          mentioner: "sydbotz@tw.com",
          caseNoteId: 8,
          id: 1,
          caseId: 4
        },
        {
          user: "veronicablackwell@tw.com",
          updatedAt: "2019-11-29T19:31:41.953Z",
          caseReference: "CC2019-0018",
          mentioner: "wanchenyao@tw.com",
          caseNoteId: 6,
          id: 2,
          caseId: 18
        },
        {
          user: "veronicablackwell@tw.com",
          updatedAt: "2019-11-29T19:31:41.953Z",
          caseReference: "CC2019-0030",
          mentioner: "wanchenyao@tw.com",
          caseNoteId: 3,
          id: 7,
          caseId: 20
        }
      ])
    );

    return wrapper;
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

  test("getUsers should be dispatched when notificationList is rendered", async () => {
    renderNotificationList();

    await wait(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(getUsers());
    });
  });

  test("getCaseDetails should be dispatched when a notification card is clicked", async () => {
    const { getAllByTestId } = renderNotificationList();

    const notificationCard = getAllByTestId("notificationCard")[1];

    fireEvent.click(notificationCard);

    await wait(() => {
      expect(dispatchSpy).toHaveBeenCalledWith(getCaseDetails(18));
    });
  });

  test("notification card should reference correct case details link", async () => {
    const { getAllByTestId } = renderNotificationList();

    const notificationCard = getAllByTestId("notificationCard")[0];

    fireEvent.click(notificationCard);

    await wait(() => {
      expect(window.location.href).toEqual(`${window.location.origin}/cases/4`);
    });
  });

  test("should see red snackbar for when notification is deleted from case note", async () => {
    responseBody = {
      data: { caseNoteExists: true, notificationExists: false }
    };

    const { getAllByTestId } = renderNotificationList();
    const notificationCard = getAllByTestId("notificationCard")[1];

    fireEvent.click(notificationCard);

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

    const { getAllByTestId } = renderNotificationList();
    const notificationCard = getAllByTestId("notificationCard")[1];

    fireEvent.click(notificationCard);

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
    const { getAllByTestId } = renderNotificationList();

    const notificationCard = getAllByTestId("notificationCard")[1];

    fireEvent.click(notificationCard);

    await wait(() => {
      expect(axios.get).toHaveBeenCalledWith(`/api/notifications/6/2`);
    });
  });

  test("drawer should close when user clicks on notification and is already on notification's case details page", async () => {
    responseBody = {
      data: { caseNoteExists: true, notificationExists: true }
    };

    const { getAllByTestId } = renderNotificationList();

    const notificationCard = getAllByTestId("notificationCard")[2];

    fireEvent.click(notificationCard);
    fireEvent.click(notificationCard);

    await wait(() => {
      expect(handleClickAway).toHaveBeenCalledTimes(1);
    });
  });
});
