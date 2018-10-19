import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";
import {
  addBackgroundJobFailure,
  clearCurrentExportJob,
  generateExportSuccess
} from "../../actionCreators/exportActionCreators";
import config from "../../config/config";

const generateExportJob = path => async dispatch => {
  const hostname = config[process.env.NODE_ENV].hostname;
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  try {
    const response = await axios.get(`${hostname}${path}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    dispatch(generateExportSuccess(response.data));
  } catch (error) {
    dispatch(clearCurrentExportJob());
    dispatch(addBackgroundJobFailure());
  }
};

export default generateExportJob;
