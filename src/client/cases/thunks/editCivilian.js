import {
  closeEditDialog,
  editCivilianFailed,
  editCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";
import {
  startSubmit,
  stopSubmit,
} from "redux-form";
import { CIVILIAN_FORM_NAME } from "../../../sharedUtilities/constants";

const editCivilian = civilian => async dispatch => {
  try {
    dispatch(startSubmit(CIVILIAN_FORM_NAME));
    const response = await axios.put(
      `api/civilian/${civilian.id}`,
      JSON.stringify(civilian)
    );
    dispatch(closeEditDialog());
    dispatch(editCivilianSuccess(response.data));
    const event = await dispatch(getCaseNotes(response.data.id));
    dispatch(stopSubmit(CIVILIAN_FORM_NAME));
    return event;
  } catch (e) {
    dispatch(stopSubmit(CIVILIAN_FORM_NAME));
    return dispatch(editCivilianFailed());
  }
};

export default editCivilian;
