import {
  closeEditDialog,
  createCivilianFailure,
  createCivilianSuccess
} from "../../actionCreators/casesActionCreators";
import getCaseNotes from "./getCaseNotes";
import axios from "axios";

const createCivilian = civilian => async dispatch => {
  try {
    const response = await axios.post(
      `api/civilian`,
      JSON.stringify(civilian)
    );
    dispatch(createCivilianSuccess(response.data));
    dispatch(closeEditDialog());
    return await dispatch(getCaseNotes(response.data.id));
  } catch (e) {
    return dispatch(createCivilianFailure());
  }
};

export default createCivilian;
