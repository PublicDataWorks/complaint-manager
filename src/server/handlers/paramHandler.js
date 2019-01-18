import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import models from "../models";
const Boom = require("boom");

export const handleCaseIdParam = async function(
  request,
  response,
  next,
  caseId
) {
  const existingCase = await models.cases.findById(caseId);
  try {
    if (!existingCase) {
      next(Boom.badRequest(BAD_REQUEST_ERRORS.CASE_DOES_NOT_EXIST));
    } else {
      request.caseId = caseId;
      next();
    }
  } catch (error) {
    next(error);
  }
};
