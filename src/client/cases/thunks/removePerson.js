import {
  closeRemovePersonDialog,
  removePersonFailure,
  removePersonSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import {
  startSubmit,
  stopSubmit,
} from "redux-form";
import {REMOVE_PERSON_FORM_NAME} from "../../../sharedUtilities/constants";

const removePerson = ({ personType, id, caseId }) => async dispatch => {
  const personTypeForDisplay =
    personType === "civilians" ? "civilian" : "officer";
  try {
    dispatch(startSubmit(REMOVE_PERSON_FORM_NAME));
    const response = await axios.delete(
      `api/cases/${caseId}/${personType}/${id}`
    );
    dispatch(closeRemovePersonDialog());
    const event = await dispatch(removePersonSuccess(response.data, personTypeForDisplay));
    dispatch(stopSubmit(REMOVE_PERSON_FORM_NAME));
    return event;
  } catch (error) {
    dispatch(stopSubmit(REMOVE_PERSON_FORM_NAME));
    return dispatch(removePersonFailure(personTypeForDisplay));
  }
};

export default removePerson;
