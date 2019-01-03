import Boom from "boom";
import models from "../../../models";
import { CASE_STATUSES_ALLOWED_TO_EDIT_LETTER } from "../../../../sharedUtilities/constants";

const checkForValidStatus = async (
  caseId,
  statuses = CASE_STATUSES_ALLOWED_TO_EDIT_LETTER
) => {
  const existingCase = await models.cases.findById(caseId);
  if (!statuses.includes(existingCase.status)) {
    throw Boom.badRequest("Invalid case status");
  }
};

export default checkForValidStatus;
