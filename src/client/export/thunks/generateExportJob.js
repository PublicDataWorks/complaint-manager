import axios from "axios";
import {
  clearCurrentExportJob,
  generateExportSuccess
} from "../../actionCreators/exportActionCreators";

const generateExportJob = path => async dispatch => {
  try {
    const response = await axios.get(path);
    dispatch(generateExportSuccess(response.data));
  } catch (error) {
    dispatch(clearCurrentExportJob());
  }
};

export default generateExportJob;
