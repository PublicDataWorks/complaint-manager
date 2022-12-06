import { GET_COMPLAINT_TYPES_SUCCEEDED } from "../../../../sharedUtilities/constants";

const initialState = [];

const complaintTypeReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_COMPLAINT_TYPES_SUCCEEDED:
      return action.payload;
    default:
      return state;
  }
};

export default complaintTypeReducer;
