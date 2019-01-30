import { getCaseWithoutAssociations } from "./getCaseHelpers";
import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import { ROUTES_ALLOWED_TO_MODIFY_ARCHIVED_CASE } from "../apiRoutes";

export const handleCaseIdParam = async function(
  request,
  response,
  next,
  caseId
) {
  try {
    const existingCase = await getCaseWithoutAssociations(caseId);
    request.caseId = caseId;
    if (caseCannotBeEdited(existingCase.isArchived, request)) {
      next(Boom.badRequest(BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE));
    }
    request.isArchived = existingCase.isArchived;
    next();
  } catch (error) {
    next(error);
  }
};

const caseCannotBeEdited = (isArchived, request) => {
  return (
    isArchived &&
    request.method !== "GET" &&
    request.route &&
    !ROUTES_ALLOWED_TO_MODIFY_ARCHIVED_CASE.includes(request.route.path)
  );
};
