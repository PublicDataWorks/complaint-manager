import { getUsersSuccess } from "../../actionCreators/usersActionCreators";
import getAccessToken from "../../auth/getAccessToken";
import { push } from "react-router-redux";
import axios from "axios";

const testing = process.env.NODE_ENV === "test";
const hostname = testing ? "http://localhost" : "";

const getUsers = () => async dispatch => {
  try {
    const token = getAccessToken();
    if (!token) {
      dispatch(push("/login"));
      throw new Error("No access token found");
    }

    const response = await axios(`${hostname}/api/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    });
    return dispatch(getUsersSuccess(response.data.users));
  } catch (e) {}
};

export default getUsers;
