import iaProCorrectionDialogReducer from "./iaProCorrectionDialogReducer";
import {
  closeRemoveIAProCorrectionDialog,
  openRemoveIAProCorrectionDialog
} from "../../actionCreators/letterActionCreators";

describe("iaProCorrectionDialogReducer", function() {
  test("initial state is closed with empty fieldArrayName and correctionIndex", () => {
    const expectedState = {
      dialogOpen: false,
      fieldArrayName: undefined,
      correctionIndex: undefined
    };
    const newState = iaProCorrectionDialogReducer(undefined, {
      type: "SOMETHING"
    });
    expect(newState).toEqual(expectedState);
  });

  describe("openRemoveIAProCorrectionDialog", () => {
    test("sets open to true, sets fields and index", () => {
      const expectedState = {
        dialogOpen: true,
        fieldArrayName: "something",
        correctionIndex: 5
      };
      const newState = iaProCorrectionDialogReducer(
        undefined,
        openRemoveIAProCorrectionDialog("something", 5)
      );
      expect(newState).toEqual(expectedState);
    });
  });

  describe("closeRemoveIAProCorrectionDialog", () => {
    test("sets open to false, sets fields and index", () => {
      const expectedState = {
        dialogOpen: false,
        fieldArrayName: undefined,
        correctionIndex: undefined
      };
      const newState = iaProCorrectionDialogReducer(
        {
          dialogOpen: true,
          fieldArrayName: "something",
          correctionIndex: 5
        },
        closeRemoveIAProCorrectionDialog()
      );
      expect(newState).toEqual(expectedState);
    });
  });
});
