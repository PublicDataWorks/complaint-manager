import { push } from "connected-react-router";
import { clearSelectedOfficer } from "../../actionCreators/officersActionCreators";
import axios from "axios";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { OFFICER_TITLE } from "../../../../sharedUtilities/constants";

const {
  PERSON_TYPE
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

const editCaseOfficer =
  (caseId, caseOfficerId, officerId, caseEmployeeType, values) =>
  async dispatch => {
    try {
      const payload = { ...values, officerId };
      const caseEmployeeTitle =
        caseEmployeeType?.includes("Civilian") && PERSON_TYPE.CIVILIAN_WITHIN_PD
          ? PERSON_TYPE.CIVILIAN_WITHIN_PD.description
          : OFFICER_TITLE;
      await axios.put(
        `api/cases/${caseId}/cases-officers/${caseOfficerId}`,
        payload
      );
      dispatch(
        snackbarSuccess(`${caseEmployeeTitle} was successfully updated`)
      );
      dispatch(clearSelectedOfficer());
      return dispatch(push(`/cases/${caseId}`));
    } catch (error) {}
  };

export default editCaseOfficer;
