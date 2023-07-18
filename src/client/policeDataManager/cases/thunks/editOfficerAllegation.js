import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";
import { updateAllegationDetailsSuccess } from "../../actionCreators/casesActionCreators";
import getAllegationOptions from "../../allegations/thunks/getAllegationOptions";
import axios from "axios";
import _ from "lodash";

const editOfficerAllegation = (allegation, caseId) => async dispatch => {
  let ruleChapter = allegation.ruleChapter;
  let directive = allegation.directive;

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
    requestBody.directiveName = directive;
  } else {
    requestBody.directiveId = directive;
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

    if (requestBody.ruleChapterName || requestBody.directiveName) {
      dispatch(getAllegationOptions());
    }

    dispatch(updateAllegationDetailsSuccess(allegation.id, response.data));
    return dispatch(snackbarSuccess("Allegation was successfully updated"));
  } catch (error) {}
};

export default editOfficerAllegation;
