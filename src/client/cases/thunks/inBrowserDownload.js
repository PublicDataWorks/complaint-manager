import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import downloadFailed from "../../actionCreators/downloadActionCreators";
import axios from "axios";

const inBrowserDownload = (path, htmlContainer, callback) => async dispatch => {
  if (!getAccessToken()) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios.get(path, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    const link = document.createElement("a");
    link.href = response.data;
    document.body.appendChild(link);

    link.click();

    if (callback) callback();
  } catch (e) {
    dispatch(downloadFailed());
  }
};

export default inBrowserDownload;
