import {
  closeCaseTagDialog,
  createCaseTagSuccess
} from "../../actionCreators/casesActionCreators";
import axios from "axios";
import _ from "lodash";
import { getTagsSuccess } from "../../actionCreators/tagActionCreators";

const createCaseTag = (values, caseId) => async dispatch => {
  const tagValue = values.caseTagValue;

  const requestBody = {};

  if (_.isString(tagValue)) {
    requestBody.tagName = tagValue;
  } else {
    requestBody.tagId = tagValue;
  }

  try {
    const response = await axios.post(
      `api/cases/${caseId}/case-tags`,
      JSON.stringify(requestBody)
    );

    dispatch(createCaseTagSuccess(response.data.caseTags));
    dispatch(getTagsSuccess(response.data.tags));
    dispatch(closeCaseTagDialog());
  } catch (error) {}
};

export default createCaseTag;
