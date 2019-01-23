import { getCaseWithoutAssociations } from "./getCaseHelpers";

export const handleCaseIdParam = async function(
  request,
  response,
  next,
  caseId
) {
  try {
    await getCaseWithoutAssociations(caseId);
    request.caseId = caseId;
    next();
  } catch (error) {
    next(error);
  }
};
