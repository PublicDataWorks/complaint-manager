import {
  closeRemovePersonDialog,
  removePersonFailure,
  removePersonSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const removePerson = ({ personType, id, caseId }) => async dispatch => {
  const personTypeForDisplay =
    personType === "civilians" ? "civilian" : "officer";
  try {
    const response = await axios.delete(
      `api/cases/${caseId}/${personType}/${id}`
    );
    dispatch(closeRemovePersonDialog());
    const event = await dispatch(
      removePersonSuccess(response.data, personTypeForDisplay)
    );
    return event;
  } catch (error) {
    return dispatch(removePersonFailure(personTypeForDisplay));
  }
};

export default removePerson;
