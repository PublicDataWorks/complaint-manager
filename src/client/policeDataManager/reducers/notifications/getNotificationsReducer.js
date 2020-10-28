import { GET_NOTIFICATIONS_SUCCESS } from "../../../../sharedUtilities/constants";

const initialState = [];

const getNotificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NOTIFICATIONS_SUCCESS:
      return action.notifications;
    default:
      return state;
  }
};

export default getNotificationsReducer;
