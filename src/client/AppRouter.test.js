import { mount } from "enzyme";
import { Provider } from "react-redux";
import React, { cloneElement } from "react";
import createConfiguredStore from "./createConfiguredStore";
import { MemoryRouter } from "react-router";
import AppRouter from "./AppRouter";

jest.mock(
  "./common/components/Visualization/Visualization",
  () => "Visualization"
);

describe("AppRouter", () => {
  let appWrapper, store;
  const URL = global.URL;
  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
  });

  afterAll(() => {
    global.URL = URL;
  });

  describe("Internal Data Dashboard Route", () => {
    beforeAll(() => {
      store = createConfiguredStore();
      appWrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/dashboard"]}>
            <AppRouter />
          </MemoryRouter>
        </Provider>
      );
    });

    test("displays /dashboard complaint manager route", () => {
      appWrapper.update();
      const disProRoute = appWrapper.find("Route[path='/dashboard']");
      expect(disProRoute.exists()).toBeTrue();
    });

    test("should set page title to default 'Police Data Manager' for /dashboard route", () => {
      appWrapper.update();
      expect(document.title).toEqual("Police Data Manager");
    });
  });

  describe("Public Data Dashboard Route", () => {
    beforeAll(() => {
      store = createConfiguredStore();
      appWrapper = mount(
        <Provider store={store}>
          <MemoryRouter initialEntries={["/data"]}>
            <AppRouter />
          </MemoryRouter>
        </Provider>
      );
    });

    test("displays /data complaint manager route", () => {
      appWrapper.update();
      const disProRoute = appWrapper.find("Route[path='/data']");
      expect(disProRoute.exists()).toBeTrue();
    });

    test("should set page title to 'IPM Complaints Data' for /data route", async () => {
      appWrapper.update();
      expect(document.title).toEqual("IPM Complaints Data");
    });
  });
});
