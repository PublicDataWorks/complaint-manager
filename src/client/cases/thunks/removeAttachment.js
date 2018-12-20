import {
  removeAttachmentFailed,
  removeAttachmentSuccess
} from "../../actionCreators/attachmentsActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

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
    return await dispatch(getCaseNotes(response.data.id));
  } catch (error) {
    return dispatch(removeAttachmentFailed());
  }
};

export default removeAttachment;
