import { GET_USERS_SUCCESS } from "../../../../sharedUtilities/constants";

const initialState = [];

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_SUCCESS:
      return action.users;
    default:
      return state;
  }
};

export default usersReducer;
