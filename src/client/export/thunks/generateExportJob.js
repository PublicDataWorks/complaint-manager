import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";
import { generateExportSuccess } from "../../actionCreators/exportActionCreators";

const generateExportJob = path => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    dispatch(push("/login"));
    throw new Error("No access token found");
  }

  const response = await axios.get(path, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  dispatch(generateExportSuccess(response.data));
};

export default generateExportJob;
