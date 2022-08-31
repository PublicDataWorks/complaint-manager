import Boom from "boom";
import { CASE_STATUSES_ALLOWED_TO_EDIT_LETTER } from "../../../../sharedUtilities/constants";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { getCaseWithoutAssociations } from "../../getCaseHelpers";

const throwErrorIfLetterFlowUnavailable = async (
  caseId,
  statuses = CASE_STATUSES_ALLOWED_TO_EDIT_LETTER
) => {
  const existingCase = await getCaseWithoutAssociations(caseId);
  if (
    !statuses.includes(await existingCase.getStatus()) ||
    existingCase.isArchived
  ) {
    throw Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_CASE_STATUS);
  }
};

export default throwErrorIfLetterFlowUnavailable;
