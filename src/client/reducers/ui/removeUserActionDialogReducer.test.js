import removeUserActionDialogReducer from "./removeUserActionDialogReducer";
import {
  closeRemoveUserActionDialog,
  openRemoveUserActionDialog
} from "../../actionCreators/casesActionCreators";

describe("removeUserActionDialogReducer", () => {
  test("should set default state", () => {
    const newState = removeUserActionDialogReducer(undefined, {
      type: "anything here"
    });

    expect(newState).toEqual({
      dialogOpen: false,
      caseId: null,
      userActionId: null
    });
  });

  test("should set dialogOpen to true when open dialog requested", () => {
    const dialogClosedState = {
      dialogOpen: false,
      caseId: null,
      userActionId: null
    };
    const newState = removeUserActionDialogReducer(
      dialogClosedState,
      openRemoveUserActionDialog()
    );

    expect(newState).toEqual({
      dialogOpen: true,
      caseId: null,
      userActionId: null
    });
  });

  test("should set dialogOpen to false when close dialog requested", () => {
    const dialogClosedState = {
      dialogOpen: true,
      caseId: 23,
      userActionId: 54
    };
    const newState = removeUserActionDialogReducer(
      dialogClosedState,
      closeRemoveUserActionDialog()
    );

    expect(newState).toEqual({
      dialogOpen: false,
      caseId: null,
      userActionId: null
    });
  });

  test("should set caseId and userActionId", () => {
    const dialogClosedState = {
      dialogOpen: false
    };
    const caseId = 1;
    const userActionId = 2;

    const newState = removeUserActionDialogReducer(
      dialogClosedState,
      openRemoveUserActionDialog(caseId, userActionId)
    );

    expect(newState).toEqual({ dialogOpen: true, caseId, userActionId });
  });
});
