import axios from "axios";
import { closeArchiveCaseDialog } from "../../actionCreators/casesActionCreators";

const archiveCase = caseId => async dispatch => {
  try {
    await axios.put(`api/cases/${caseId}/archive`);

    return dispatch(closeArchiveCaseDialog());
  } catch (error) {
    console.log(error);
  }
};

export default archiveCase;
