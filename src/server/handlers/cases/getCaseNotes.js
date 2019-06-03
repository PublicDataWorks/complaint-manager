import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import legacyAuditDataAccess from "../audits/legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import auditDataAccess from "../audits/auditDataAccess";

const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../models/index");

const getCaseNotes = asyncMiddleWare(async (request, response) => {
  const caseNotes = await models.sequelize.transaction(async transaction => {
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    const caseNotesAndAuditDetails = await getAllCaseNotesAndAuditDetails(
      request.params.caseId,
      request.nickname,
      transaction
    );
    const caseNotes = caseNotesAndAuditDetails.caseNotes;
    const auditDetails = caseNotesAndAuditDetails.auditDetails;

    if (newAuditFeatureToggle) {
      await auditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        request.params.caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        transaction,
        AUDIT_ACTION.DATA_ACCESSED,
        auditDetails
      );
    }

    return caseNotes;
  });
  response.send(caseNotes);
});

const getAllCaseNotesAndAuditDetails = async (
  caseId,
  nickname,
  transaction
) => {
  const queryOptions = {
    where: {
      caseId: caseId
    },
    include: [{ model: models.case_note_action, as: "caseNoteAction" }],
    auditUser: nickname,
    transaction
  };

  const auditDetails = getQueryAuditAccessDetails(
    queryOptions,
    models.case_note.name
  );

  const caseNotes = await models.case_note.findAll(queryOptions);
  return { caseNotes: caseNotes, auditDetails: auditDetails };
};

module.exports = getCaseNotes;
