import axios from "axios";
import { getPriorityLevelSuccess } from "../../../actionCreators/priorityLevelActionCreators";

const getPriorityLevelDropdownValues = () => async dispatch => {
  try {
    const response = await axios.get(`api/priority-levels`);
    return dispatch(getPriorityLevelSuccess(response.data));
  } catch (error) {}
};

export default getPriorityLevelDropdownValues;
