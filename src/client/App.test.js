import { stringContaining } from "expect";
import createConfiguredStore from "./createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import App from "./App";
import { getFeaturesSuccess } from "./complaintManager/actionCreators/featureTogglesActionCreators";
import { mockLocalStorage } from "../mockLocalStorage";
import { userAuthSuccess } from "./common/auth/actionCreators";

jest.mock("./common/components/Visualization/PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

jest.mock("./common/auth/Auth", () =>
  jest.fn(() => ({
    setUserInfoInStore: jest.fn(() => true)
  }))
);

describe("App", () => {
  let eventSourceMock = jest.fn();
  let wrapper, store, dispatchSpy;

  process.env.REACT_APP_ENV = "test";

  beforeEach(() => {
    mockLocalStorage();
    window.localStorage.__proto__.getItem.mockReturnValue("MOCK_TOKEN");
    window.EventSource = eventSourceMock;

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

  test("Creates an eventSource only on first render", () => {
    expect(eventSourceMock).toHaveBeenCalledWith(
      stringContaining("/api/messageStream?token=MOCK_TOKEN")
    );

    // Triggers a re-render
    wrapper.update();

    expect(eventSourceMock).toHaveBeenCalledTimes(1);
  });
});
