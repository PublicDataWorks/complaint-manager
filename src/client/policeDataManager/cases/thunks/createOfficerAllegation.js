import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { createOfficerAllegationSuccess } from "../../actionCreators/allegationsActionCreators";
import getAllegationOptions from "../../allegations/thunks/getAllegationOptions";
import axios from "axios";
import _ from "lodash";

const createOfficerAllegation =
  (formValues, caseId, caseOfficerId, addAllegationSuccessCallback) =>
  async dispatch => {
    let ruleChapter = formValues.ruleChapter;
    let directive = formValues.directive;

    if (ruleChapter?.value) {
      ruleChapter = ruleChapter.value;
    }

    if (directive?.value) {
      directive = directive.value;
    }

    let requestBody = {};
    if (_.isString(ruleChapter)) {
      requestBody.ruleChapterName = ruleChapter;
    } else {
      requestBody.ruleChapterId = ruleChapter;
    }

    if (_.isString(directive)) {
      // if directive is a string, it's a custom directive
      requestBody.directiveName = directive;
    } else {
      requestBody.directiveId = directive;
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

      if (requestBody.ruleChapterName || requestBody.directiveName) {
        dispatch(getAllegationOptions());
      }

      addAllegationSuccessCallback();
      dispatch(createOfficerAllegationSuccess(response.data));
      return dispatch(snackbarSuccess("Allegation was successfully added"));
    } catch (error) {}
  };

export default createOfficerAllegation;
