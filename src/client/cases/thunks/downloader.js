import getAccessToken from "../../auth/getAccessToken";
import FileSaver from "file-saver";
import { push } from "react-router-redux";
import { UTF8_BYTE_ORDER_MARK } from "../../../sharedUtilities/constants";
import downloadFailed from "../../actionCreators/downloadActionCreators";
import axios from "axios";

const downloader = (path, filename, fileIsCsv, callback) => async dispatch => {
  if (!getAccessToken()) {
    return dispatch(push("/login"));
  }
  try {
    const responseType = fileIsCsv ? "" : "blob";

    const response = await axios.get(path, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      },
      responseType: responseType
    });

    const fileData = fileIsCsv
      ? UTF8_BYTE_ORDER_MARK + response.data
      : response.data;
    const fileToDownload = new File([fileData], filename);

    FileSaver.saveAs(fileToDownload, filename);

    if (callback) callback();
  } catch (e) {
    dispatch(downloadFailed());
  }
};

export default downloader;
