import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";

const getArchivedCases = asyncMiddleware(async (request, response) => {
  const cases = await models.sequelize.transaction(async transaction => {
    const toggleCaseDashboardPagination = checkFeatureToggleEnabled(
      request,
      "caseDashboardPaginationFeature"
    );
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    const sortBy = request.query.sortBy;
    const sortDirection = request.query.sortDirection;
    const page = toggleCaseDashboardPagination ? request.query.page : null;

    const archivedCases = await getCases(
      CASES_TYPE.ARCHIVED,
      sortBy,
      sortDirection,
      transaction,
      page
    );

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        null,
        AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
        GET_CASES_AUDIT_DETAILS,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        undefined,
        AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        GET_CASES_AUDIT_DETAILS
      );
    }

    return archivedCases;
  });

  response.status(200).send({ cases });
});

export default getArchivedCases;
