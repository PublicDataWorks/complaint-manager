import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import config from "../../config/config";
import axios from "axios";
import { getClassificationsSuccess } from "../../actionCreators/classificationActionCreators";
import { snackbarError } from "../../actionCreators/snackBarActionCreators";

const getClassficationDropdownValues = () => async dispatch => {
  const token = getAccessToken();
  if (!token) {
    return dispatch(push("/login"));
  }
  const hostname = config[process.env.NODE_ENV].hostname;
  try {
    const response = await axios(`${hostname}/api/classifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });

    return dispatch(getClassificationsSuccess(response.data));
  } catch (error) {
    return dispatch(
      snackbarError(
        "Something went wrong and we could not fetch the classification options."
      )
    );
  }
};

export default getClassficationDropdownValues;
