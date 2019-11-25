import models from "../../../complaintManager/models";
import asyncMiddleware from "../../asyncMiddleware";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../audits/auditDataAccess";

const getWorkingCases = asyncMiddleware(async (request, response) => {
  const cases = await models.sequelize.transaction(async transaction => {
    const sortBy = request.query.sortBy;
    const sortDirection = request.query.sortDirection;
    const toggleCaseDashboardPagination = checkFeatureToggleEnabled(
      request,
      "caseDashboardPaginationFeature"
    );
    const page = toggleCaseDashboardPagination ? request.query.page : null;

    const cases = await getCases(
      CASES_TYPE.WORKING,
      sortBy,
      sortDirection,
      transaction,
      page
    );

    await auditDataAccess(
      request.nickname,
      null,
      AUDIT_SUBJECT.ALL_WORKING_CASES,
      GET_CASES_AUDIT_DETAILS,
      transaction
    );

    return cases;
  });

  response.status(200).send({ cases });
});

export default getWorkingCases;
