import {
  closeEditIncidentDetailsDialog,
  openEditIncidentDetailsDialog
} from "../../actionCreators/casesActionCreators";
import editIncidentDetailsDialogReducer from "./editIncidentDetailsDialogReducer";

describe("editIncidentDetailsDialogReducer", function() {
  test("should set default state", () => {
    const newState = editIncidentDetailsDialogReducer(undefined, {
      type: "test action"
    });

    expect(newState).toEqual({
      open: false
    });
  });

  test("should set state on dialog open", () => {
    const newState = editIncidentDetailsDialogReducer(
      undefined,
      openEditIncidentDetailsDialog()
    );

    expect(newState).toEqual({
      open: true
    });
  });

  test("should set state on dialog close", () => {
    const newState = editIncidentDetailsDialogReducer(
      undefined,
      closeEditIncidentDetailsDialog()
    );
    expect(newState).toEqual({
      open: false
    });
  });
});
