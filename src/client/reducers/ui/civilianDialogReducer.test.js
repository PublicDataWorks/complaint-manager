import editDialogReducer from "./civilianDialogReducer";
import {
  closeEditDialog,
  openCivilianDialog,
  updateAddressAutoSuggest
} from "../../actionCreators/casesActionCreators";

describe("civilianDialogReducer", () => {
  test("should set default state", () => {
    const newState = editDialogReducer(undefined, { type: "any action" });

    expect(newState).toEqual({
      open: false,
      title: "",
      submitButtonText: "",
      submitAction: undefined,
      addressAutoSuggestValue: ""
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
    const newState = editDialogReducer({ open: true }, closeEditDialog());

    expect(newState).toEqual({
      open: false,
      title: "",
      submitButtonText: "",
      submitAction: undefined,
      addressAutoSuggestValue: ""
    });
  });

  test("should set current address suggestion text", () => {
    const newAddressValue = "200 East Randolph";
    const initialState = {
      open: false,
      title: "",
      submitButtonText: "",
      submitAction: undefined,
      addressAutoSuggestValue: "200 E"
    };
    const newState = editDialogReducer(
      initialState,
      updateAddressAutoSuggest(newAddressValue)
    );

    expect(newState).toEqual({
      open: false,
      title: "",
      submitButtonText: "",
      submitAction: undefined,
      addressAutoSuggestValue: newAddressValue
    });
  });
});
