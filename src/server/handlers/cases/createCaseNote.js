import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import legacyAuditDataAccess from "../legacyAuditDataAccess";
import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import auditDataAccess from "../auditDataAccess";
import getQueryAuditAccessDetails from "../getQueryAuditAccessDetails";

const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../models");

const createCaseNote = asyncMiddleware(async (request, response) => {
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const currentCase = await models.sequelize.transaction(async transaction => {
    await models.case_note.create(
      {
        ...request.body,
        user: request.nickname,
        caseId: request.params.caseId
      },
      {
        transaction,
        auditUser: request.nickname
      }
    );

    const caseNotesAndAuditDetails = await getCaseNotesAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const caseNotes = caseNotesAndAuditDetails.caseNotes;
    const caseNoteAuditDetails = caseNotesAndAuditDetails.auditDetails;

    const caseDetailsAndAuditDetails = await getCaseWithAllAssociationsAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        caseNoteAuditDetails,
        transaction
      );
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        caseAuditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        transaction
      );

      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_DETAILS,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        caseAuditDetails
      );
    }

    return { caseNotes, caseDetails };
  });

  response.status(201).send(currentCase);
});

async function getCaseNotesAndAuditDetails(caseId, transaction) {
  const caseNotesQueryOptions = {
    where: {
      caseId: caseId
    },
    include: [{ model: models.case_note_action, as: "caseNoteAction" }],
    transaction
  };

  const caseNotes = await models.case_note.findAll(caseNotesQueryOptions);

  const caseNoteAuditDetails = getQueryAuditAccessDetails(
    caseNotesQueryOptions,
    models.case_note.name
  );

  return { caseNotes: caseNotes, auditDetails: caseNoteAuditDetails };
}

module.exports = createCaseNote;
