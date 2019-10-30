import { GET_RECOMMENDED_ACTIONS_SUCCESS } from "../../../../sharedUtilities/constants";

const initialState = [];

const recommendedActionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_RECOMMENDED_ACTIONS_SUCCESS:
      return action.recommendedActions;
    default:
      return state;
  }
};
export default recommendedActionsReducer;
