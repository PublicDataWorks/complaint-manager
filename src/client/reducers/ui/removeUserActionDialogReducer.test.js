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
    const newState = removeUserActionDialogReducer(
      dialogClosedState,
      closeRemoveUserActionDialog()
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

    const newState = removeUserActionDialogReducer(
      dialogClosedState,
      openRemoveUserActionDialog(activityToRemove)
    );

    expect(newState).toEqual({ dialogOpen: true, activity: activityToRemove });
  });
});
