import { GET_SIGNERS } from "../../../sharedUtilities/constants";

const initialState = [];

const signersReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_SIGNERS:
      return action.payload;
    default:
      return state;
  }
};

export default signersReducer;
