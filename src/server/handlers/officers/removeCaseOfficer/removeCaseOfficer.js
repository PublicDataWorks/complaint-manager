import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";

const models = require("../../../models");
const asyncMiddleware = require("../../asyncMiddleware");
const Boom = require("boom");
const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");

const removeCaseOfficer = asyncMiddleware(async (request, response, next) => {
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const officerToRemove = await models.case_officer.findByPk(
    request.params.caseOfficerId
  );

  if (officerToRemove === null) {
    next(Boom.badRequest(BAD_REQUEST_ERRORS.REMOVE_CASE_OFFICER_ERROR));
  }

  const updatedCase = await models.sequelize.transaction(async transaction => {
    await officerToRemove.destroy({
      auditUser: request.nickname,
      transaction
    });

    let auditDetails = {};

    const caseDetails = await getCaseWithAllAssociations(
      request.params.caseId,
      transaction,
      auditDetails
    );

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return caseDetails;
  });

  response.status(200).send(updatedCase);
});

module.exports = removeCaseOfficer;
