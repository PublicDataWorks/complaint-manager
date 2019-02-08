import { getCaseWithoutAssociations } from "./getCaseHelpers";
import { BAD_REQUEST_ERRORS } from "../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import { ROUTES_ALLOWED_TO_HANDLE_ARCHIVED_CASE } from "../apiRoutes";

export const handleCaseIdParam = async function(
  request,
  response,
  next,
  caseId
) {
  try {
    const existingCase = await getCaseWithoutAssociations(caseId);
    request.caseId = caseId;
    request.isArchived = existingCase.isArchived;

    if (request.route && request.route === "/cases/:caseId/attachments/") {
      return next();
    }
    if (caseCannotBeEdited(existingCase.isArchived, request)) {
      return next(
        Boom.badRequest(BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE)
      );
    }
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
    !ROUTES_ALLOWED_TO_HANDLE_ARCHIVED_CASE.includes(request.route.path)
  );
};
