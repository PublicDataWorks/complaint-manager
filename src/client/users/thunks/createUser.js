import {
  createUserFailure,
  createUserSuccess,
  requestUserCreation
} from "../../actionCreators/usersActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";

const testing = process.env.NODE_ENV === "test";
const hostname = testing ? "http://localhost" : "";

const createUser = user => async dispatch => {
  dispatch(requestUserCreation());

  try {
    const token = getAccessToken();

    if (!token) {
      dispatch(push("/login"));
      throw Error("No Token");
    }

    const response = await axios(`${hostname}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      data: JSON.stringify(user)
    });

    return dispatch(createUserSuccess(response.data));
  } catch (e) {
    dispatch(createUserFailure());
  }
};

export default createUser;
