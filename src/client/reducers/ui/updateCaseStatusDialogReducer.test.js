import updateCaseStatusDialogReducer from "./updateCaseStatusDialogReducer";
import {
  closeCaseStatusUpdateDialog,
  openCaseStatusUpdateDialog
} from "../../actionCreators/casesActionCreators";

describe("updateCaseStatusDialogReducer", () => {
  test("should set the default state", () => {
    const expectedState = {
      open: false,
      redirectUrl: null
    };

    const actualState = updateCaseStatusDialogReducer(undefined, {
      type: "MOCK_ACTION"
    });

    expect(actualState).toEqual(expectedState);
  });

  test("should set dialog to open and set redirect url when dispatching action to open dialog", () => {
    const oldState = {
      open: false,
      redirectUrl: null
    };

    const expectedState = {
      open: true,
      redirectUrl: "url"
    };

    const actualState = updateCaseStatusDialogReducer(
      oldState,
      openCaseStatusUpdateDialog("url")
    );

    expect(actualState).toEqual(expectedState);
  });

  test("should set dialog to closed when dispatching action to close dialog", () => {
    const oldState = {
      open: true,
      redirectUrl: "something"
    };

    const expectedState = {
      open: false,
      redirectUrl: null
    };

    const actualState = updateCaseStatusDialogReducer(
      oldState,
      closeCaseStatusUpdateDialog()
    );

    expect(actualState).toEqual(expectedState);
  });
});
