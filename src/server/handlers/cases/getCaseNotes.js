import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import { generateAndAddAuditDetailsFromQuery } from "../getQueryAuditAccessDetails";

const { AUDIT_SUBJECT } = require("../../../sharedUtilities/constants");
const asyncMiddleWare = require("../asyncMiddleware");
const models = require("../../models/index");
import legacyAuditDataAccess from "../legacyAuditDataAccess";
import checkFeatureToggleEnabled from "../../checkFeatureToggleEnabled";
import auditDataAccess from "../auditDataAccess";

const getCaseNotes = asyncMiddleWare(async (request, response) => {
  const caseNotes = await models.sequelize.transaction(async transaction => {
    const newAuditFeatureToggle = checkFeatureToggleEnabled(
      request,
      "newAuditFeature"
    );

    let auditDetails = {};

    const caseNotes = findAllCaseNotes(
      auditDetails,
      request.params.caseId,
      request.nickname,
      transaction
    );

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

const findAllCaseNotes = async (
  auditDetails,
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

  generateAndAddAuditDetailsFromQuery(
    auditDetails,
    queryOptions,
    models.case_note.name
  );

  return await models.case_note.findAll(queryOptions);
};

module.exports = getCaseNotes;
