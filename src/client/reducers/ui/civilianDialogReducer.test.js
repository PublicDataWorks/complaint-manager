import editDialogReducer from "./civilianDialogReducer";
import {
  closeEditCivilianDialog,
  openCivilianDialog
} from "../../actionCreators/casesActionCreators";

describe("civilianDialogReducer", () => {
  test("should set default state", () => {
    const newState = editDialogReducer(undefined, { type: "any action" });

    expect(newState).toEqual({
      open: false,
      title: "",
      submitButtonText: "",
      submitAction: undefined
    });
  });

  test("should set state on dialog open", () => {
    const mockFunction = jest.fn();
    const newState = editDialogReducer(
      undefined,
      openCivilianDialog("test title", "submit text", mockFunction)
    );

    expect(newState).toMatchObject({
      open: true,
      title: "test title",
      submitButtonText: "submit text",
      submitAction: mockFunction
    });
  });

  test("should set state on dialog close", () => {
    const newState = editDialogReducer(
      { open: true },
      closeEditCivilianDialog()
    );

    expect(newState).toEqual({
      open: false,
      title: "",
      submitButtonText: "",
      submitAction: undefined
    });
  });
});
