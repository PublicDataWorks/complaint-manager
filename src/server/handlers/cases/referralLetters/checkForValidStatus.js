import Boom from "boom";
import models from "../../../models";
import { CASE_STATUSES_ALLOWED_TO_EDIT_LETTER } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";

const checkForValidStatus = async (
  caseId,
  statuses = CASE_STATUSES_ALLOWED_TO_EDIT_LETTER
) => {
  const existingCase = await models.cases.findById(caseId);
  if (!statuses.includes(existingCase.status)) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS);
  }
};

export default checkForValidStatus;
