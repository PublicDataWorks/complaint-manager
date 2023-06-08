import createConfiguredStore from "./createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import App from "./App";
import { getFeaturesSuccess } from "./policeDataManager/actionCreators/featureTogglesActionCreators";
import { userAuthSuccess } from "./common/auth/actionCreators";
import getNotifications from "./policeDataManager/shared/thunks/getNotifications";
import EventSource from "eventsourcemock";
import { sources } from "eventsourcemock";
import { snackbarError } from "./policeDataManager/actionCreators/snackBarActionCreators";
import { INTERNAL_ERRORS } from "../sharedUtilities/errorMessageConstants";

const config = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/clientConfig`);

Object.defineProperty(window, "EventSource", {
  value: EventSource
});

jest.mock("react-ga4");

jest.mock("./common/components/Visualization/PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

jest.mock("./common/auth/Auth", () =>
  jest.fn(() => ({
    setUserInfoInStore: jest.fn(() => true),
    setDummyUserInfoInStore: jest.fn(() => true)
  }))
);

jest.mock(
  "./policeDataManager/shared/thunks/getNotifications",
  () => values => ({
    type: "MOCK_THUNK",
    values: values
  })
);

jest.mock("./common/auth/getAccessToken", () => jest.fn(() => "MOCK_TOKEN"));

process.env.REACT_APP_ENV = "test";
const backendUrl = config[process.env.REACT_APP_ENV].backendUrl;

describe("App", () => {
  let wrapper, store, dispatchSpy;
  const eventSourceUrl = `${backendUrl}/api/messageStream?token=MOCK_TOKEN`;

  beforeEach(() => {
    store = createConfiguredStore();
    dispatchSpy = jest.spyOn(store, "dispatch");
    wrapper = mount(
      <Provider store={store}>
        <App />
      </Provider>
    );

    store.dispatch(
      getFeaturesSuccess({
        realtimeNotificationsFeature: true
      })
    );
    store.dispatch(
      userAuthSuccess({
        nickname: "MOCK_USER",
        permissions: []
      })
    );
  });

  test("should create an eventSource at correct location with correct token and connection opened at correct time", () => {
    expect(sources[eventSourceUrl].readyState).toBe(0);
    sources[eventSourceUrl].emitOpen();

    expect(sources[eventSourceUrl].readyState).toBe(1);

    for (let [key] of Object.entries(sources)) {
      expect(key).toEqual(eventSourceUrl);
    }
  });

  test("should create an eventSource only on first render and stay open", () => {
    expect(sources[eventSourceUrl].readyState).toBe(0);
    sources[eventSourceUrl].emitOpen();

    expect(sources[eventSourceUrl].readyState).toBe(1);

    const connection = {
      type: "connection",
      message: "connection succeeded"
    };
    const jsonConnect = JSON.stringify(connection);
    sources[eventSourceUrl].emitMessage(jsonConnect);

    expect(sources[eventSourceUrl].readyState).toBe(1);

    // Triggers a re-rerender
    wrapper.update();

    expect(sources[eventSourceUrl].readyState).toBe(1);
  });

  test("getNotifications should be dispatched when bell is clicked to open drawer ONLY", () => {
    const notifications = {
      type: "notifications",
      message: [
        { user: "MOCK_USER", hasBeenRead: true },
        { user: "MOCK_USER", hasBeenRead: false }
      ]
    };
    const jsonNotifications = JSON.stringify(notifications);

    sources[eventSourceUrl].emitOpen();

    sources[eventSourceUrl].emitMessage(jsonNotifications);

    expect(dispatchSpy).toHaveBeenLastCalledWith(
      getNotifications(notifications.message)
    );
  });

  test("should dispatch red snackbar when eventSource receives an error", () => {
    sources[eventSourceUrl].emitOpen();

    sources[eventSourceUrl].emitError();

    expect(dispatchSpy).toHaveBeenCalledWith(
      snackbarError(INTERNAL_ERRORS.NOTIFICATIONS_RETRIEVAL_FAILURE)
    );
  });

  test("should close the EventSource on unmount", () => {
    sources[eventSourceUrl].emitOpen();

    wrapper.unmount();
    expect(sources[eventSourceUrl].readyState).toBe(2);
  });
});
