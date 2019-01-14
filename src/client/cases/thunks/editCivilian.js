import {
  closeEditDialog,
  editCivilianFailed,
  editCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

const editCivilian = civilian => async dispatch => {
  try {
    const response = await axios.put(
      `api/civilian/${civilian.id}`,
      JSON.stringify(civilian)
    );
    dispatch(closeEditDialog());
    dispatch(editCivilianSuccess(response.data));
    return await dispatch(getCaseNotes(response.data.id));
  } catch (e) {
    return dispatch(editCivilianFailed());
  }
};

export default editCivilian;
