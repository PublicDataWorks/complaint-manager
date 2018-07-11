import getAccessToken from "../../auth/getAccessToken";
import FileSaver from "file-saver";
import { push } from "react-router-redux";
import downloadFailed from "../../actionCreators/downloadActionCreators";
import axios from "axios";
import { UTF8_BYTE_ORDER_MARK } from "../../../sharedUtilities/constants";

const downloader = (path, filename, callback) => async dispatch => {
  if (!getAccessToken()) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios(path, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    const fileToDownload = new File(
      [UTF8_BYTE_ORDER_MARK + response.data],
      filename,
      { type: "text/csv;charset=utf-8" }
    );
    FileSaver.saveAs(fileToDownload, filename);

    if (callback) callback();
  } catch (e) {
    dispatch(downloadFailed());
  }
};

export default downloader;
