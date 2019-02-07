import removeAttachmentConfirmationDialogReducer from "./removeAttachmentConfirmationDialogReducer";
import {
  closeRemoveAttachmentConfirmationDialog,
  exitedRemoveAttachmentConfirmationDialog,
  openRemoveAttachmentConfirmationDialog
} from "../../actionCreators/casesActionCreators";

describe("removeAttachmentConfirmationDialogReducer", () => {
  test("inital state is closed with empty attachmentfilename", () => {
    const expectedState = { dialogOpen: false, attachmentFileName: "" };

    const newState = removeAttachmentConfirmationDialogReducer(undefined, {
      type: "WHATEVER"
    });

    expect(newState).toEqual(expectedState);
  });

  test("openRemoveAttachmentConfirmationDialog sets open to true, sets attachmentFileName", () => {
    const attachmentFileName = "filename";

    const expectedState = {
      dialogOpen: true,
      attachmentFileName: attachmentFileName
    };

    const newState = removeAttachmentConfirmationDialogReducer(
      undefined,
      openRemoveAttachmentConfirmationDialog(attachmentFileName)
    );
    expect(newState).toEqual(expectedState);
  });

  test("closeRemoveAttachmentConfirmationDialog sets open to false", () => {
    const expectedState = expect.objectContaining({ dialogOpen: false });

    const newState = removeAttachmentConfirmationDialogReducer(
      undefined,
      closeRemoveAttachmentConfirmationDialog()
    );

    expect(newState).toEqual(expectedState);
  });

  test("exitedRemoveAttachmentConfirmationDialog sets attachmentFilename to empty", () => {
    const expectedState = expect.objectContaining({ attachmentFileName: "" });

    const newState = removeAttachmentConfirmationDialogReducer(
      undefined,
      exitedRemoveAttachmentConfirmationDialog()
    );

    expect(newState).toEqual(expectedState);
  });
});
