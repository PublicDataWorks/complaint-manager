import caseValidationDialogReducer from "./caseValidationDialogReducer";
import {
  closeCaseValidationDialog,
  openCaseValidationDialog
} from "../../actionCreators/casesActionCreators";

describe("caseValidationDialogReducer", () => {
  test("should set dialog to open", () => {
    const oldState = {
      open: false,
      redirectUrl: null
    };

    const expectedState = {
      open: true,
      redirectUrl: null,
      validationErrors: [{ field: "test", message: "test error" }]
    };

    const actualState = caseValidationDialogReducer(
      oldState,
      openCaseValidationDialog([{ field: "test", message: "test error" }])
    );

    expect(actualState).toEqual(expectedState);
  });

  test("should set dialog to closed", () => {
    const oldState = {
      open: true,
      redirectUrl: null,
      validationErrors: [{ field: "test", message: "test error" }]
    };

    const expectedState = {
      open: false,
      redirectUrl: null,
      validationErrors: [{ field: "test", message: "test error" }]
    };

    const actualState = caseValidationDialogReducer(
      oldState,
      closeCaseValidationDialog()
    );

    expect(actualState).toEqual(expectedState);
  });
});
