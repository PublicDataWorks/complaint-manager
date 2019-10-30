import updateCaseStatusDialogReducer from "./updateCaseStatusDialogReducer";
import {
  closeCaseStatusUpdateDialog,
  openCaseStatusUpdateDialog,
  submitCaseStatusUpdateDialog
} from "../../actionCreators/casesActionCreators";

describe("updateCaseStatusDialogReducer", () => {
  test("should set the default state", () => {
    const expectedState = {
      open: false,
      redirectUrl: null,
      submittable: false,
      nextStatus: null
    };

    const actualState = updateCaseStatusDialogReducer(undefined, {
      type: "MOCK_ACTION"
    });

    expect(actualState).toEqual(expectedState);
  });

  test("should set dialog to open and set redirect url when dispatching action to open dialog", () => {
    const oldState = {
      open: false,
      redirectUrl: null,
      submittable: false,
      nextStatus: null
    };

    const expectedState = {
      open: true,
      redirectUrl: "url",
      submittable: true,
      nextStatus: "status"
    };

    const actualState = updateCaseStatusDialogReducer(
      oldState,
      openCaseStatusUpdateDialog("status", "url")
    );

    expect(actualState).toEqual(expectedState);
  });

  test("should set submittable to false when submitting", () => {
    const oldState = {
      open: true,
      redirectUrl: "something",
      submittable: true,
      nextStatus: "status"
    };

    const expectedState = {
      open: true,
      redirectUrl: "something",
      submittable: false,
      nextStatus: "status"
    };

    const actualState = updateCaseStatusDialogReducer(
      oldState,
      submitCaseStatusUpdateDialog()
    );

    expect(actualState).toEqual(expectedState);
  });

  test("should set dialog to closed when dispatching action to close dialog", () => {
    const oldState = {
      open: true,
      redirectUrl: "something",
      submittable: false,
      nextStatus: "status"
    };

    const expectedState = {
      open: false,
      redirectUrl: null,
      submittable: false,
      nextStatus: "status"
    };

    const actualState = updateCaseStatusDialogReducer(
      oldState,
      closeCaseStatusUpdateDialog()
    );

    expect(actualState).toEqual(expectedState);
  });
});
