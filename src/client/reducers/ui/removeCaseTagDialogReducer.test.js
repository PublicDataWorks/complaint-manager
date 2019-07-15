import removeCaseTagDialogReducer from "./removeCaseTagDialogReducer";
import {
  closeRemoveCaseTagDialog,
  openRemoveCaseTagDialog
} from "../../actionCreators/casesActionCreators";

describe("removeCaseTagDialogReducer", () => {
  test("should set default state", () => {
    const newState = removeCaseTagDialogReducer(undefined, {
      type: "a whole new state"
    });

    expect(newState).toEqual({
      dialogOpen: false,
      caseTag: expect.objectContaining({
        tag: expect.objectContaining({
          name: ""
        })
      })
    });
  });

  test("should set dialog open to true and caseTag when dialog is opened", () => {
    const caseTagToInclude = {
      id: 1,
      caseId: 1,
      tagId: 1,
      tag: {
        id: 1,
        name: "Tofu"
      }
    };

    const newState = removeCaseTagDialogReducer(
      undefined,
      openRemoveCaseTagDialog(caseTagToInclude)
    );

    expect(newState).toEqual({
      dialogOpen: true,
      caseTag: expect.objectContaining({
        id: 1,
        tag: expect.objectContaining({
          name: "Tofu"
        })
      })
    });
  });

  test("should set dialog open to false when dialog is closed", () => {
    const dialogOpenedState = {
      dialogOpen: true,
      caseTag: {
        id: 1,
        caseId: 1,
        tagId: 1,
        tag: {
          id: 1,
          name: "Tofu"
        }
      }
    };

    const newState = removeCaseTagDialogReducer(
      dialogOpenedState,
      closeRemoveCaseTagDialog()
    );

    expect(newState).toEqual({
      dialogOpen: false,
      caseTag: dialogOpenedState.caseTag
    });
  });
});
