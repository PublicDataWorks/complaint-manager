import getAccessToken from "../../auth/getAccessToken";
import { push } from "connected-react-router";
import config from "../../config/config";
import {
  getAllegationsFailed,
  getAllegationsSuccess
} from "../../actionCreators/allegationsActionCreators";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getAllegationDropdownValues = () => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      return dispatch(push("/login"));
    }

    const response = await axios(`${hostname}/api/allegations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return dispatch(getAllegationsSuccess(response.data));
  } catch (e) {
    return dispatch(getAllegationsFailed());
  }
};

export default getAllegationDropdownValues;
