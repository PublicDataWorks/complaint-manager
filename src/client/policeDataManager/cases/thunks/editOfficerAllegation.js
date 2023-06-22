import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";
import getRuleChapters from "../../allegations/thunks/getRuleChapters";
import axios from "axios";
import _ from "lodash";

const editOfficerAllegation = (allegation, caseId) => async dispatch => {
  let ruleChapter = allegation.ruleChapter;
  if (ruleChapter?.value) {
    ruleChapter = ruleChapter.value;
  }

  let requestBody = {};
  if (_.isString(ruleChapter)) {
    requestBody.ruleChapterName = ruleChapter;
  } else {
    requestBody.ruleChapterId = ruleChapter;
  }

  const updatedFormValues = {
    ...requestBody,
    id: allegation.id,
    allegationId: allegation.allegationId,
    details: allegation.details,
    severity: allegation.severity
  };

  try {
    const response = await axios.put(
      `/api/cases/${caseId}/officers-allegations/${allegation.id}`,
      updatedFormValues
    );

    if (requestBody.ruleChapterName) {
      dispatch(getRuleChapters());
    }

    dispatch(updateAllegationDetailsSuccess(allegation.id, response.data));
    return dispatch(snackbarSuccess("Allegation was successfully updated"));
  } catch (error) {}
};

export default editOfficerAllegation;
