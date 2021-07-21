const { GET_TAGS_CLEARED } = require("../../../../sharedUtilities/constants");

const clearTagManagement = () => dispatch => {
  dispatch({ type: GET_TAGS_CLEARED });
};

export default clearTagManagement;
