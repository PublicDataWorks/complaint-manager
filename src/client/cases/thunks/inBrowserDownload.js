import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import downloadFailed from "../../actionCreators/downloadActionCreators";
import axios from "axios";

const inBrowserDownload = (path, htmlAnchorId, callback) => async dispatch => {
  if (!getAccessToken()) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios.get(path, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    triggerDownload(htmlAnchorId, response);
  } catch (e) {
    dispatch(downloadFailed());
  } finally {
    if (callback) {
      callback();
    }
  }
};

const triggerDownload = (htmlAnchorId, response) => {
  const htmlAnchor = document.getElementById(htmlAnchorId);
  htmlAnchor.href = response.data;
  htmlAnchor.click();
};

export default inBrowserDownload;
