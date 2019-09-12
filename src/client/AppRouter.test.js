import { mount } from "enzyme";
import { Provider } from "react-redux";
import React from "react";
import createConfiguredStore from "./createConfiguredStore";
import { MemoryRouter } from "react-router";
import { getFeaturesSuccess } from "./actionCreators/featureTogglesActionCreators";
describe("AppRouter", () => {
  let appWrapper, store;

  beforeEach(() => {
    store = createConfiguredStore();
    appWrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={["/disciplinary-proceedings", "/styleguide"]}
        >
          <AppRouter featureToggles={store.getState().featureToggles} />
        </MemoryRouter>
      </Provider>
    );
  });

  test("displays disciplinary proceedings route when feature flag enabled", () => {
    store.dispatch(
      getFeaturesSuccess({
        disciplinaryProceedingsFeature: true,
        styleGuideFeature: true
      })
    );
    appWrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={["/disciplinary-proceedings", "/styleguide"]}
        >
          <AppRouter featureToggles={store.getState().featureToggles} />
        </MemoryRouter>
      </Provider>
    );
    const disProRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    const styleRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(disProRoute.exists()).toBeTrue();
    expect(styleRoute.exists()).toBeTrue();
  });

  test("displays disciplinary proceedings route when feature flag doesn't exist", () => {
    const disProRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    const styleRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(disProRoute.exists()).toBeTrue();
    expect(styleRoute.exists()).toBeTrue();
    expect(appWrapper.find("AppRouter").props().featureToggles).toEqual({});
  });

  test("does not display disciplinary proceedings route when feature flag disabled", () => {
    store = createConfiguredStore();
    store.dispatch(
      getFeaturesSuccess({
        disciplinaryProceedingsFeature: false,
        styleGuideFeature: false
      })
    );
    //Not a connected component; doesn't trigger re-render when global state changes
    appWrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={["/disciplinary-proceedings", "/styleguide"]}
        >
          <AppRouter featureToggles={store.getState().featureToggles} />
        </MemoryRouter>
      </Provider>
    );
    const disProRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    const styleRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(disProRoute.exists()).toBeFalse();
    expect(styleRoute.exists()).toBeFalse();
  });
});

import AppRouter from "./AppRouter";
