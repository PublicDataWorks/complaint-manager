import { GET_RULE_CHAPTERS_SUCCESS } from "../../../../sharedUtilities/constants";
import axios from "axios";

const getRuleChapters = () => async dispatch => {
  try {
    const ruleChaptersResponse = await axios.get(`api/rule-chapters`);
    return dispatch({
      type: GET_RULE_CHAPTERS_SUCCESS,
      payload: ruleChaptersResponse.data
    });
  } catch (error) {}
};

export default getRuleChapters;
