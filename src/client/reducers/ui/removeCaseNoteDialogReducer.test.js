import removeCaseNoteDialogReducer from "./removeCaseNoteDialogReducer";
import {
  closeRemoveCaseNoteDialog,
  openRemoveCaseNoteDialog
} from "../../actionCreators/casesActionCreators";

describe("removeCaseNoteDialogReducer", () => {
  test("should set default state", () => {
    const newState = removeCaseNoteDialogReducer(undefined, {
      type: "anything here"
    });

    expect(newState).toEqual({
      dialogOpen: false,
      activity: {}
    });
  });

  test("should set dialogOpen to false when close dialog requested", () => {
    const dialogClosedState = {
      dialogOpen: true,
      activity: {
        some: "data"
      }
    };
    const newState = removeCaseNoteDialogReducer(
      dialogClosedState,
      closeRemoveCaseNoteDialog()
    );

    expect(newState).toEqual({
      dialogOpen: false,
      activity: dialogClosedState.activity
    });
  });

  test("should set activity to remove", () => {
    const dialogClosedState = {
      dialogOpen: false
    };

    const activityToRemove = {
      some: "activity",
      to: "remove"
    };

    const newState = removeCaseNoteDialogReducer(
      dialogClosedState,
      openRemoveCaseNoteDialog(activityToRemove)
    );

    expect(newState).toEqual({ dialogOpen: true, activity: activityToRemove });
  });
});
