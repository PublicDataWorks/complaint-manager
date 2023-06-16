import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { createOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";
import axios from "axios";
import _ from "lodash";

const createOfficerAllegation =
  (formValues, caseId, caseOfficerId, addAllegationSuccessCallback) =>
  async dispatch => {
    let ruleChapter = formValues.ruleChapterId;
    if (ruleChapter.value) {
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
      allegationId: formValues.allegationId,
      details: formValues.details,
      severity: formValues.severity
    };

    try {
      const response = await axios.post(
        `api/cases/${caseId}/cases-officers/${caseOfficerId}/officers-allegations`,
        updatedFormValues
      );
      addAllegationSuccessCallback();
      dispatch(createOfficerAllegationSuccess(response.data));
      return dispatch(snackbarSuccess("Allegation was successfully added"));
    } catch (error) {}
  };

export default createOfficerAllegation;
