import { GET_USERS_SUCCESS } from "../../../sharedUtilities/constants";

export const getUsersSuccess = users => ({
  type: GET_USERS_SUCCESS,
  users
});
