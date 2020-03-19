import axios from "axios";
import { getNotificationsSuccess } from "../../actionCreators/notificationActionCreators";
import moment from "moment";

const getNotifications = user => async dispatch => {
  const thirtyDaysAgo = moment().subtract(30, "days");

  try {
    const url = `/api/notifications/${user}/?timestamp=${thirtyDaysAgo}`;
    const response = await axios.get(url);
    console.log("Got notifications", response.data);
    return dispatch(getNotificationsSuccess(response.data));
  } catch (error) {}
};

export default getNotifications;
