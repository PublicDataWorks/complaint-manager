import { getNotificationsSuccess } from "../../actionCreators/notificationActionCreators";

const getNotifications = notifications => async dispatch => {
  try {
    return dispatch(getNotificationsSuccess(notifications));
  } catch (error) {
    console.error(error);
  }
};

export default getNotifications;
