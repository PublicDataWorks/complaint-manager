import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const _ = require("lodash");

const createOfficerAllegation = asyncMiddleware(async (request, response) => {
  const allegationAttributes = _.pick(request.body, [
    "allegationId",
    "details",
    "severity"
  ]);
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const caseWithAssociations = await models.sequelize.transaction(
    async transaction => {
      const caseOfficer = await models.case_officer.findByPk(
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

      let auditDetails = {};

      const caseDetails = await getCaseWithAllAssociations(
        request.params.caseId,
        transaction,
        auditDetails
      );

      if (newAuditFeatureToggle) {
        await auditDataAccess(
          request.nickname,
          caseOfficer.caseId,
          AUDIT_SUBJECT.CASE_DETAILS,
          auditDetails,
          transaction
        );
      } else {
        await legacyAuditDataAccess(
          request.nickname,
          caseOfficer.caseId,
          AUDIT_SUBJECT.CASE_DETAILS,
          transaction,
          AUDIT_ACTION.DATA_ACCESSED,
          auditDetails
        );
      }

      return caseDetails;
    }
  );

  return response.status(201).send(caseWithAssociations);
});

module.exports = createOfficerAllegation;
