import ReactGA from "react-ga";
import createConfiguredStore from "./createConfiguredStore";
import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import UsePageTracking from "./UsePageTracking";
import AppRouter from "./AppRouter";
import { MemoryRouter } from "react-router";

jest.mock("./common/components/Visualization/PlotlyWrapper", () => {
  const FakeWrapper = jest.fn(() => "PlotlyWrapper");
  return { PlotlyWrapper: FakeWrapper };
});

describe("UsePageTracking", () => {
  let store, wrapper;

  beforeEach(() => {
    store = createConfiguredStore();
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/dashboard"]}>
          <AppRouter />
          <div>
            <UsePageTracking isTestModeEnabled={true} />
          </div>
        </MemoryRouter>
      </Provider>
    );
  });

  test("Should track page views using react-ga", () => {
    expect(ReactGA.testModeAPI.calls).toEqual([
      ["create", "UA-184896339-1", "auto"],
      ["send", { hitType: "pageview", page: "/dashboard" }]
    ]);
  });
});
