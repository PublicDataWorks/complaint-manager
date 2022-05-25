import removePersonDialogReducer from "./removePersonDialogReducer";
import {
  closeRemovePersonDialog,
  openRemovePersonDialog
} from "../../actionCreators/casesActionCreators";

describe("removePersonDialogReducer", () => {
  test("should set default state", () => {
    const newState = removePersonDialogReducer(undefined, {
      type: "some action"
    });
    expect(newState).toEqual({
      open: false,
      personDetails: {},
      optionalText: "",
      personTypeTitleDisplay: ""
    });
  });

  test("should set open to true on REMOVE_PERSON_DIALOG_OPENED", () => {
    const oldState = {
      open: false,
      personDetails: {}
    };
    const personDetails = { details: "some details" };

    const actualState = removePersonDialogReducer(
      oldState,
      openRemovePersonDialog(personDetails, "civilians", "NOPD")
    );

    const expectedState = {
      open: true,
      personDetails: { ...personDetails, personType: "civilians" },
      personTypeTitleDisplay: "Civilian",
      optionalText: ""
    };

    expect(actualState).toEqual(expectedState);
  });

  test("should set open to false on REMOVE_PERSON_DIALOG_CLOSED", () => {
    const oldState = {
      open: true,
      personDetails: { some: "details" }
    };

    const actualState = removePersonDialogReducer(
      oldState,
      closeRemovePersonDialog()
    );

    const expectedState = {
      open: false,
      personDetails: {},
      personTypeTitleDisplay: "",
      optionalText: ""
    };

    expect(actualState).toEqual(expectedState);
  });
});
