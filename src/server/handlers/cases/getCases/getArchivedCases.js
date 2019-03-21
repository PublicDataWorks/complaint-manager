import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";
import getCases, { CASES_TYPE } from "./getCases";

const getArchivedCases = asyncMiddleware(async (request, response) => {
  const cases = await models.sequelize.transaction(async transaction => {
    let auditDetails = {};

    const sortBy = request.params.sortBy;
    const sortDirection = request.params.sortDirection;

    const archivedCases = await getCases(
      CASES_TYPE.ARCHIVED,
      sortBy,
      sortDirection,
      transaction,
      auditDetails
    );

    await auditDataAccess(
      request.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      auditDetails
    );

    return archivedCases;
  });

  response.status(200).send({ cases });
});

export default getArchivedCases;
