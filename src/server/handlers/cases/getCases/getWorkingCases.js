import models from "../../../policeDataManager/models";
import asyncMiddleware from "../../asyncMiddleware";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import getCases, { CASES_TYPE, GET_CASES_AUDIT_DETAILS } from "./getCases";
import auditDataAccess from "../../audits/auditDataAccess";

const getWorkingCases = asyncMiddleware(async (request, response) => {
  const cases = await models.sequelize.transaction(async transaction => {
    const sortBy = request.query.sortBy;
    const sortDirection = request.query.sortDirection;
    const page = request.query.page;

    const cases = await getCases(
      CASES_TYPE.WORKING,
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
      AUDIT_SUBJECT.ALL_WORKING_CASES,
      GET_CASES_AUDIT_DETAILS,
      transaction
    );

    return cases;
  });

  response.status(200).send({ cases });
});

export default getWorkingCases;
