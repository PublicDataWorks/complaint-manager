import models from "../../../policeDataManager/models";
import asyncMiddleware from "../../asyncMiddleware";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import auditDataAccess from "../../audits/auditDataAccess";

const getArchivedCases = asyncMiddleware(async (request, response) => {
  const cases = await models.sequelize.transaction(async transaction => {
    const sortBy = request.query.sortBy;
    const sortDirection = request.query.sortDirection;
    const page = request.query.page;

    const archivedCases = await getCases(
      CASES_TYPE.ARCHIVED,
      sortBy,
      sortDirection,
      transaction,
      page,
      request.permissions
    );

    await auditDataAccess(
      request.nickname,
      null,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
      GET_CASES_AUDIT_DETAILS,
      transaction
    );

    return archivedCases;
  });

  response.status(200).send({ cases });
});

export default getArchivedCases;
