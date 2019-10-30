import { removeAttachmentSuccess } from "../../actionCreators/attachmentsActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const removeAttachment = (
  caseId,
  fileName,
  shouldCloseDialog
) => async dispatch => {
  try {
    const response = await axios.delete(
      `api/cases/${caseId}/attachments/${fileName}`
    );
    shouldCloseDialog();
    dispatch(removeAttachmentSuccess(response.data));
    dispatch(snackbarSuccess("File was successfully removed"));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (error) {}
};

export default removeAttachment;
