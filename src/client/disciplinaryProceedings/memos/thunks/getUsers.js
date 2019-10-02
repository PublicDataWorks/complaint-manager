import axios from "axios";
import { getUsersSuccess } from "../../../actionCreators/shared/usersActionCreators";
import { snackbarError } from "../../../actionCreators/snackBarActionCreators";

const getUsers = () => async dispatch => {
  try {
    const response = await axios.get("api/users");
    return dispatch(getUsersSuccess(response.data));
  } catch (error) {
    return dispatch(snackbarError("Unable to get users. Please try again."));
  }
};

export default getUsers;
