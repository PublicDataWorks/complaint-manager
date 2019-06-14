import { GET_TAGS_SUCCEEDED } from "../../sharedUtilities/constants";

export const getTagsSuccess = tags => {
  return {
    type: GET_TAGS_SUCCEEDED,
    tags
  };
};
