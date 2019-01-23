const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
const models = require("../../../models");
const _ = require("lodash");
const auditDataAccess = require("../../auditDataAccess");

const createOfficerAllegation = asyncMiddleware(async (request, response) => {
  const allegationAttributes = _.pick(request.body, [
    "allegationId",
    "details",
    "severity"
  ]);

  const caseWithAssociations = await models.sequelize.transaction(
    async transaction => {
      const caseOfficer = await models.case_officer.findById(
        request.params.caseOfficerId,
        { transaction }
      );

      await caseOfficer.createAllegation(
        allegationAttributes,
        {
          auditUser: request.nickname
        },
        { transaction }
      );

      await auditDataAccess(
        request.nickname,
        caseOfficer.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction
      );

      return await getCaseWithAllAssociations(
        request.params.caseId,
        transaction
      );
    }
  );

  return response.status(201).send(caseWithAssociations);
});

module.exports = createOfficerAllegation;
