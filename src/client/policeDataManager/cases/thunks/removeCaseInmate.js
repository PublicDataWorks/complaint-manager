import axios from "axios";
import { removeSelectedInmate } from "../../actionCreators/inmateActionCreators";

const removeCaseInmate = (caseId, caseInmateId) => async dispatch => {
  try {
    await axios.delete(`api/cases/${caseId}/inmates/${caseInmateId}`);
    dispatch(removeSelectedInmate());
  } catch (error) {}
};

export default removeCaseInmate;
