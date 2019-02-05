import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";
import getCases, { CASES_TYPE } from "./getCases";

const getWorkingCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      req.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_CASES,
      transaction
    );

    return await getCases(transaction, CASES_TYPE.WORKING);
  });

  res.status(200).send({ cases });
});

module.exports = getWorkingCases;
