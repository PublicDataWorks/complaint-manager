import React from "react";
import { Provider } from "react-redux";
import CaseCreationSnackbar from "./CaseCreationSnackbar";
import { mount } from "enzyme";
import createConfiguredStore from "../../createConfiguredStore";
import SharedSnackbar from "../../sharedComponents/SharedSnackbar";

describe("connected CaseCreationSnackbar", () => {
  let snackbarWrapper;
  let snackbar;

  beforeEach(() => {
    snackbarWrapper = mount(
      <Provider store={createConfiguredStore()}>
        <CaseCreationSnackbar />
      </Provider>
    );

    snackbar = snackbarWrapper.find(SharedSnackbar);
  });

  test("should map creationSuccess from state", () => {
    expect(snackbar.prop("success")).toBeDefined();
  });

  test("should map message from state", () => {
    expect(snackbar.prop("message")).toBeDefined();
  });

  test("should map dispatch to props", () => {
    expect(snackbar.prop("closeSnackbar")).toBeDefined();
  });

  test("map open from state", () => {
    expect(snackbar.prop("open")).toBeDefined();
  });
});
