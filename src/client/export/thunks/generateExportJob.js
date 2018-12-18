import axios from "axios";
import {
  addBackgroundJobFailure,
  clearCurrentExportJob,
  generateExportSuccess
} from "../../actionCreators/exportActionCreators";
import config from "../../config/config";

const generateExportJob = path => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const response = await axios.get(`${hostname}${path}`);
    dispatch(generateExportSuccess(response.data));
  } catch (error) {
    dispatch(clearCurrentExportJob());
    dispatch(addBackgroundJobFailure());
  }
};

export default generateExportJob;
