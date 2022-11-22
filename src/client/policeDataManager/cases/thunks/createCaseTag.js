import {
  closeCaseTagDialog,
  createCaseTagSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import _ from "lodash";
import { getTagsSuccess } from "../../actionCreators/tagActionCreators";
import { snackbarSuccess } from "../../actionCreators/snackBarActionCreators";

const createCaseTag = (values, caseId) => async dispatch => {
  let tagValue = values.caseTagValue;
  if (tagValue.value) {
    tagValue = tagValue.value;
  }

  const requestBody = {};

  if (_.isString(tagValue)) {
    requestBody.tagName = tagValue;
  } else {
    requestBody.tagId = tagValue;
  }

  try {
    const response = await axios.post(
      `api/cases/${caseId}/case-tags`,
      requestBody
    );

    dispatch(snackbarSuccess("Case tag was successfully added"));
    dispatch(createCaseTagSuccess(response.data.caseTags));
    dispatch(getTagsSuccess(response.data.tags));
    dispatch(closeCaseTagDialog());
  } catch (error) {}
};

export default createCaseTag;
