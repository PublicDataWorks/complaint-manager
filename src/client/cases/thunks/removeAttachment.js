import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  removeAttachmentFailed,
  removeAttachmentSuccess
} from "../../actionCreators/attachmentsActionCreators";
import config from "../../config/config";
import getRecentActivity from "./getRecentActivity";
const hostname = config[process.env.NODE_ENV].hostname;

const removeAttachment = (
  caseId,
  fileName,
  shouldCloseDialog
) => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push(`/login`));
      return dispatch(removeAttachmentFailed());
    }
    const response = await fetch(
      `${hostname}/api/cases/${caseId}/attachments/${fileName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    switch (response.status) {
      case 200:
        const caseDetails = await response.json();
        shouldCloseDialog();
        dispatch(removeAttachmentSuccess(caseDetails));
        return await dispatch(getRecentActivity(caseDetails.id));
      case 401:
        dispatch(push(`/login`));
        return dispatch(removeAttachmentFailed());
      default:
        return dispatch(removeAttachmentFailed());
    }
  } catch (error) {
    return dispatch(removeAttachmentFailed());
  }
};

export default removeAttachment;
