import {
  GET_NOTIFICATIONS_FAILURE,
  GET_NOTIFICATIONS_SUCCESS,
  SNACKBAR_ERROR
} from "../../../sharedUtilities/constants";

export const getNotificationsSuccess = notifications => ({
  type: GET_NOTIFICATIONS_SUCCESS,
  notifications
});

export const getNotificationsFailure = message => ({
  type: SNACKBAR_ERROR,
  message: message
});
