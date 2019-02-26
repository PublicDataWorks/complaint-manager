import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";
import getCases, { CASES_TYPE } from "./getCases";

const getWorkingCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    let auditDetails = {};

    const cases = await getCases(CASES_TYPE.WORKING, transaction, auditDetails);

    await auditDataAccess(
      req.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_WORKING_CASES,
      transaction,
      AUDIT_ACTION.DATA_ACCESSED,
      auditDetails
    );

    return cases;
  });

  res.status(200).send({ cases });
});

export default getWorkingCases;
