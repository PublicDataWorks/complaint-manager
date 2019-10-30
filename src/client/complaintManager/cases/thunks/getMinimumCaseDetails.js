import axios from "axios/index";
import { getMinimumCaseDetailsSuccess } from "../../actionCreators/casesActionCreators";

const getMinimumCaseDetails = caseId => async dispatch => {
  try {
    const minimumCaseDetails = await axios.get(
      `api/cases/${caseId}/minimum-case-details`
    );
    dispatch(getMinimumCaseDetailsSuccess(minimumCaseDetails.data));
  } catch (error) {}
};

export default getMinimumCaseDetails;
