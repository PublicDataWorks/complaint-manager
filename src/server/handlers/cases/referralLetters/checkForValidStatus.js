import Boom from "boom";
import models from "../../../models";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

const VALID_STATUSES = [
  CASE_STATUS.LETTER_IN_PROGRESS,
  CASE_STATUS.READY_FOR_REVIEW
];

const checkForValidStatus = async caseId => {
  const existingCase = await models.cases.findById(caseId);
  if (!VALID_STATUSES.includes(existingCase.status)) {
    throw Boom.badRequest("Invalid case status.");
  }
};

export default checkForValidStatus;
