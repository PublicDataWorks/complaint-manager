import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";

const getWorkingCases = asyncMiddleware(async (request, response) => {
  const cases = await models.sequelize.transaction(async transaction => {
    let auditDetails = {};

    const toggleCaseDashboardPagination = checkFeatureToggleEnabled(
      request,
      "caseDashboardPagination"
    );
    const sortBy = request.params.sortBy;
    const sortDirection = request.params.sortDirection;
    const page = toggleCaseDashboardPagination ? request.params.page : null;

    const cases = await getCases(
      CASES_TYPE.WORKING,
      sortBy,
      sortDirection,
      transaction,
      page
    );

    await auditDataAccess(
      request.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_WORKING_CASES,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      GET_CASES_AUDIT_DETAILS
    );

    return cases;
  });

  response.status(200).send({ cases });
});

export default getWorkingCases;
