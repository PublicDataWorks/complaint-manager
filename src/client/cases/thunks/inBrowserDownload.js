import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import downloadFailed from "../../actionCreators/downloadActionCreators";
import axios from "axios";

const inBrowserDownload = (path, htmlAnchorId) => async dispatch => {
  if (!getAccessToken()) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios.get(path, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    const htmlAnchor = document.getElementById(htmlAnchorId);
    htmlAnchor.href = response.data;
    htmlAnchor.click();
  } catch (e) {
    dispatch(downloadFailed());
  }
};

export default inBrowserDownload;
