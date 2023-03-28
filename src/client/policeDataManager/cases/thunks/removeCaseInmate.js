import axios from "axios";
import {
  removeSelectedInmate,
  removeSelectedInmateSucceeded
} from "../../actionCreators/inmateActionCreators";

const removeCaseInmate = (caseId, caseInmateId) => async dispatch => {
  try {
    const response = await axios.delete(
      `api/cases/${caseId}/inmates/${caseInmateId}`
    );
    dispatch(removeSelectedInmate());
    return dispatch(removeSelectedInmateSucceeded(response.data));
  } catch (error) {}
};

export default removeCaseInmate;
