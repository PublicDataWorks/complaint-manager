import moment from "moment";
import axios from "axios";
import { getNotificationsSuccess } from "../../actionCreators/notificationActionCreators";

const getNotificationsForUser = user => async dispatch => {
  const thirtyDaysAgo = moment().subtract(30, "days");
  try {
    const url = `/api/notifications/${user}/?timestamp=${thirtyDaysAgo}`;
    const response = await axios.get(url);
    return dispatch(getNotificationsSuccess(response.data));
  } catch (error) {
    console.error(error);
  }
};

export default getNotificationsForUser;
