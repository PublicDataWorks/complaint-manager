import createDialogReducer from "./createDialogReducer";
import { openCreateDialog } from "../../actionCreators/createDialogActionCreators";
import { DialogTypes } from "../../actionCreators/dialogTypes";
import { closeCreateDialog } from "../../actionCreators/createDialogActionCreators";

describe("createDialogReducer", () => {
  test("should set initial state", () => {
    const expectedState = {
      case: {
        open: false
      },
      matrix: {
        open: false
      }
    };

    const actualState = createDialogReducer(undefined, {
      type: "SOME_ACTION"
    });
    expect(actualState).toEqual(expectedState);
  });

  test("should open the dialog", () => {
    const initialState = {
      case: {
        open: false
      },
      matrix: {
        open: false
      }
    };
    const expectedState = {
      case: {
        open: true
      },
      matrix: {
        open: false
      }
    };

    const actualState = createDialogReducer(
      initialState,
      openCreateDialog(DialogTypes.CASE)
    );
    expect(actualState).toEqual(expectedState);
  });

  test("should close the dialog", () => {
    const initialState = {
      case: {
        open: true
      },
      matrix: {
        open: false
      }
    };
    const expectedState = {
      case: {
        open: false
      },
      matrix: {
        open: false
      }
    };

    const actualState = createDialogReducer(
      initialState,
      closeCreateDialog(DialogTypes.CASE)
    );
    expect(actualState).toEqual(expectedState);
  });
});
