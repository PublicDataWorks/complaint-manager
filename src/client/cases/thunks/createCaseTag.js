import {
  closeCaseTagDialog,
  createCaseTagSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";

const createCaseTag = values => async dispatch => {
  try {
    const response = await axios.post(
      `api/cases/${values.caseId}/case-tags`,
      JSON.stringify({ caseTag: values.caseTag })
    );

    dispatch(createCaseTagSuccess(response.data.caseTags));
    dispatch(closeCaseTagDialog());
  } catch (error) {}
};

export default createCaseTag;
