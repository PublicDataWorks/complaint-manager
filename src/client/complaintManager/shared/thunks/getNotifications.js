import axios from "axios";
import {
  getNotificationsFailure,
  getNotificationsSuccess
} from "../../actionCreators/notificationActionCreators";
import moment from "moment";

const getNotifications = user => async dispatch => {
  const thirtyDaysAgo = moment().subtract(30, "days");
  const message =
    "Something went wrong, and your notifications could not be retrieved.";

  try {
    const url = `/api/notifications/${user}/?timestamp=${thirtyDaysAgo}`;
    const response = await axios.get(url);
    console.log("Got notifications", response.data);
    return dispatch(getNotificationsSuccess(response.data));
  } catch (error) {
    return dispatch(getNotificationsFailure(message));
  }
};

export default getNotifications;
