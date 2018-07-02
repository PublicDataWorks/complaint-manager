import { push } from "react-router-redux";
import getAccessToken from "../../auth/getAccessToken";
import {
  removeAttachmentFailed,
  removeAttachmentSuccess
} from "../../actionCreators/attachmentsActionCreators";
import config from "../../config/config";
import getRecentActivity from "./getRecentActivity";
import axios from "axios";

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
    const response = await axios(
      `${hostname}/api/cases/${caseId}/attachments/${fileName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    );

    shouldCloseDialog();
    dispatch(removeAttachmentSuccess(response.data));
    return await dispatch(getRecentActivity(response.data.id));
  } catch (error) {
    return dispatch(removeAttachmentFailed());
  }
};

export default removeAttachment;
