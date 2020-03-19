import { GET_NOTIFICATIONS_SUCCESS } from "../../../sharedUtilities/constants";

export const getNotificationsSuccess = notifications => ({
  type: GET_NOTIFICATIONS_SUCCESS,
  notifications
});
