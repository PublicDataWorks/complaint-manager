import { getCasesSuccess } from "../../actionCreators/casesActionCreators";
import { push } from "connected-react-router";
import getAccessToken from "../../auth/getAccessToken";
import config from "../../config/config";
import axios from "axios";

const hostname = config[process.env.NODE_ENV].hostname;

const getCases = () => async dispatch => {
  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push("/login"));
      throw new Error("No access token found");
    }

    const response = await axios(`${hostname}/api/cases`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return dispatch(getCasesSuccess(response.data.cases));
  } catch (e) {}
};

export default getCases;
