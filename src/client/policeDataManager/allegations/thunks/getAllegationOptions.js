import { GET_DIRECTIVES_SUCCESS, GET_RULE_CHAPTERS_SUCCESS } from "../../../../sharedUtilities/constants";
import axios from "axios";

const getAllegationOptions = () => async dispatch => {
  try {
    axios.get(`api/rule-chapters`).then( ruleChaptersResponse => {    
      dispatch({
        type: GET_RULE_CHAPTERS_SUCCESS,
        payload: ruleChaptersResponse.data
      }); 
    });
    axios.get(`api/directives`).then( directivesResponse => {
      dispatch({
        type: GET_DIRECTIVES_SUCCESS,
        payload: directivesResponse.data
      });
    });
  } catch (error) {}
};

export default getAllegationOptions;
