import axios from "axios";
import {
  clearCurrentExportJob,
  generateExportSuccess
} from "../../actionCreators/exportActionCreators";
import encodeUriWithQueryParams from "../../utilities/encodeUriWithQueryParams";

const generateExportJob = (path, dateRange) => async dispatch => {
  try {
    let uri = path;
    if (dateRange) {
      uri = encodeUriWithQueryParams(path, dateRange);
    }
    const response = await axios.get(uri);
    dispatch(generateExportSuccess(response.data));
  } catch (error) {
    dispatch(clearCurrentExportJob());
  }
};

export default generateExportJob;
