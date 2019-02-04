import { getCasesOptions } from "./getCases";
import Sequelize from "sequelize";

import models from "../../../models";
import asyncMiddleware from "../../asyncMiddleware";
import { AUDIT_SUBJECT } from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../auditDataAccess";

const Op = Sequelize.Op;

const getArchivedCases = asyncMiddleware(async (req, res) => {
  const cases = await models.sequelize.transaction(async transaction => {
    await auditDataAccess(
      req.nickname,
      undefined,
      AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
      transaction
    );

    return await models.cases.findAll(
      {
        where: {
          deletedAt: { [Op.ne]: null }
        },
        paranoid: false,
        ...getCasesOptions
      },
      { transaction }
    );
  });

  res.status(200).send({ cases });
});

export default getArchivedCases;
