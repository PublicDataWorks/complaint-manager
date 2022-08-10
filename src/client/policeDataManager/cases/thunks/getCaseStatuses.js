import { CASE_STATUSES_RETRIEVED } from "../../../../sharedUtilities/constants";
import axios from "axios";

const getCaseStatuses = () => dispatch => {
  axios
    .get("/api/case-statuses")
    .then(statuses => {
      dispatch({ payload: statuses.data, type: CASE_STATUSES_RETRIEVED });
    })
    .catch(error => {
      console.error(error);
    });
};

export default getCaseStatuses;