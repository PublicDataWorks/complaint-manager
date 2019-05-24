import { AUDIT_ACTION } from "../../../../sharedUtilities/constants";
import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import auditDataAccess from "../../auditDataAccess";
import getQueryAuditAccessDetails from "../../getQueryAuditAccessDetails";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");

const removeCaseNote = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const caseNoteId = request.params.caseNoteId;
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.case_note.destroy({
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: request.nickname
    });

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      caseId,
      transaction
    );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;

    const caseNotesQueryOptions = {
      where: { caseId },
      transaction
    };
    const caseNotes = await models.case_note.findAll(caseNotesQueryOptions);
    const caseNotesAuditDetails = getQueryAuditAccessDetails(
      caseNotesQueryOptions,
      models.case_note.name
    );

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        caseAuditDetails,
        transaction
      );

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        caseNotesAuditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        caseAuditDetails
      );

      await legacyAuditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        transaction
      );
    }

    return {
      caseDetails,
      caseNotes
    };
  });
  response.status(200).send(currentCase);
});

module.exports = removeCaseNote;
