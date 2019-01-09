import {
  closeEditDialog,
  createCivilianFailure,
  createCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import { CIVILIAN_FORM_NAME } from "../../../sharedUtilities/constants";
import axios from "axios";
import {
  startSubmit,
  stopSubmit,
} from 'redux-form';

const createCivilian = civilian => async dispatch => {
  try {
    dispatch(startSubmit(CIVILIAN_FORM_NAME));
    const response = await axios.post(`api/civilian`, JSON.stringify(civilian));
    dispatch(createCivilianSuccess(response.data));
    dispatch(closeEditDialog());
    await dispatch(getCaseNotes(response.data.id));
    dispatch(stopSubmit(CIVILIAN_FORM_NAME));
  } catch (e) {
    dispatch(stopSubmit(CIVILIAN_FORM_NAME));
    return dispatch(createCivilianFailure());
  }
};

export default createCivilian;
