import removeCaseNoteDialogReducer from "./removeCaseNoteDialogReducer";
import {
  closeRemoveCaseNoteDialog,
  openRemoveCaseNoteDialog,
  toggleRemoveCaseNoteButtonDisabled
} from "../../actionCreators/casesActionCreators";

describe("removeCaseNoteDialogReducer", () => {
  test("should set default state", () => {
    const newState = removeCaseNoteDialogReducer(undefined, {
      type: "anything here"
    });

    expect(newState).toEqual({
      dialogOpen: false,
      activity: {},
      removeCaseButtonDisabled: false
    });
  });

  test("should set dialogOpen to false when close dialog requested", () => {
    const dialogClosedState = {
      dialogOpen: true,
      activity: {
        some: "data"
      },
      removeCaseButtonDisabled: false
    };
    const newState = removeCaseNoteDialogReducer(
      dialogClosedState,
      closeRemoveCaseNoteDialog()
    );

    expect(newState).toEqual({
      dialogOpen: false,
      activity: dialogClosedState.activity,
      removeCaseButtonDisabled: false
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

  test("should toggle remove button enabled on toggle request", () => {
    const preToggleState = {
      dialogOpen: true,
      activity: {},
      removeCaseButtonDisabled: false
    };

    const postToggleState = removeCaseNoteDialogReducer(
      preToggleState,
      toggleRemoveCaseNoteButtonDisabled()
    );

    expect(postToggleState).toEqual({
      ...preToggleState,
      removeCaseButtonDisabled: !preToggleState.removeCaseButtonEnabled
    });
  });
});
