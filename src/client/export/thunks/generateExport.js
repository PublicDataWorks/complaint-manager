import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";

const generateExport = path => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    dispatch(push("/login"));
    throw new Error("No access token found");
  }

  await axios.get(path, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export default generateExport;
