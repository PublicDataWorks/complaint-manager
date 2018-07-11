import getAccessToken from "../../auth/getAccessToken";
import FileSaver from "file-saver";
import { push } from "react-router-redux";
import { UTF8_BYTE_ORDER_MARK } from "../../../sharedUtilities/constants";
import downloadFailed from "../../actionCreators/downloadActionCreators";
import axios from "axios";

const downloader = (
  path,
  filename,
  fileNeedsUtfEncoding,
  callback
) => async dispatch => {
  if (!getAccessToken()) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios(path, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    });

    const fileData = fileNeedsUtfEncoding
      ? UTF8_BYTE_ORDER_MARK + response.data
      : response.data;
    const fileToDownload = new File([fileData], filename, { type: "text/csv;charset=utf-8" });

    FileSaver.saveAs(fileToDownload, filename);

    if (callback) callback();
  } catch (e) {
    dispatch(downloadFailed());
  }
};

export default downloader;
