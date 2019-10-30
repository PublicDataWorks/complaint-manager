import snackbarReducer from "./snackbarReducer";
import { updateNarrativeFailure } from "../../actionCreators/casesActionCreators";
import {
  closeSnackbar,
  snackbarError,
  snackbarSuccess
} from "../../actionCreators/snackBarActionCreators";
import {
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS
} from "../../../../sharedUtilities/constants";

describe("snackbarReducer", () => {
  test("should default open to false", () => {
    const state = snackbarReducer(undefined, { type: "SOME_ACTION" });
    expect(state.open).toEqual(false);
    expect(state.success).toEqual(false);
    expect(state.message).toEqual("");
  });

  describe(SNACKBAR_ERROR, () => {
    test("should set open to true, success false, and message to given message", () => {
      const initialState = { open: false, success: false, message: "" };
      const state = snackbarReducer(
        initialState,
        snackbarError("Something happened!")
      );
      expect(state.open).toEqual(true);
      expect(state.success).toEqual(false);
      expect(state.message).toEqual("Something happened!");
    });
  });

  describe(SNACKBAR_SUCCESS, () => {
    test("should set open to true, success false, and message to given message", () => {
      const initialState = { open: false, success: false, message: "" };
      const state = snackbarReducer(
        initialState,
        snackbarSuccess("Something good happened!")
      );
      expect(state.open).toEqual(true);
      expect(state.success).toEqual(true);
      expect(state.message).toEqual("Something good happened!");
    });
  });

  describe("CLOSE_SNACKBAR", () => {
    test("should set open to false", () => {
      const initialState = {
        open: true,
        success: false,
        message: "You failed"
      };

      const state = snackbarReducer(initialState, closeSnackbar());

      expect(state.open).toBe(false);
      expect(state.success).toBe(false);
      expect(state.message).toBe("You failed");
    });
  });
});
