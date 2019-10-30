import { mount } from "enzyme";
import { Provider } from "react-redux";
import React, { cloneElement } from "react";
import createConfiguredStore from "./createConfiguredStore";
import { MemoryRouter } from "react-router";
import { getFeaturesSuccess } from "./complaintManager/actionCreators/featureTogglesActionCreators";
import StyleGuide from "./common/globalStyling/StyleGuide";
import AppRouter from "./AppRouter";
import { MatrixList } from "./matrixManager/matrices/MatrixList/MatrixList";

describe("AppRouter", () => {
  let appWrapper, store;

  beforeEach(() => {
    store = createConfiguredStore();
    appWrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={["/disciplinary-proceedings"]}>
          <AppRouter />
        </MemoryRouter>
      </Provider>
    );
  });

  test("displays disciplinary proceedings route when feature flag enabled", () => {
    store.dispatch(
      getFeaturesSuccess({
        disciplinaryProceedingsFeature: true
      })
    );
    appWrapper.update();
    const disProRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(disProRoute.exists()).toBeTrue();
  });

  test("displays disciplinary proceedings route when feature flag doesn't exist", () => {
    const disProRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(disProRoute.exists()).toBeTrue();
    expect(appWrapper.find("AppRouter").props().featureToggles).toEqual({});
  });

  test("does not display disciplinary proceedings route when feature flag disabled", () => {
    store.dispatch(
      getFeaturesSuccess({
        disciplinaryProceedingsFeature: false
      })
    );
    appWrapper.update();
    const disProRoute = appWrapper.find(
      "Route[path='/disciplinary-proceedings']"
    );
    expect(disProRoute.exists()).toBeFalse();
  });
});
