import axios from "axios";
import { getUsersSuccess } from "../../../actionCreators/shared/usersActionCreators";

const getUsers = () => async dispatch => {
  try {
    const response = await axios.get("api/users");
    return dispatch(getUsersSuccess(response.data));
  } catch (error) {}
};

export default getUsers;
