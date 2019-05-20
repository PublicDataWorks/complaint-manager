import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const _ = require("lodash");
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import auditDataAccess from "../../auditDataAccess";
import { generateAndAddAuditDetailsFromQuery } from "../../getQueryAuditAccessDetails";

const editCaseNote = asyncMiddleware(async (request, response) => {
  const caseId = request.params.caseId;
  const caseNoteId = request.params.caseNoteId;
  const valuesToUpdate = _.pick(request.body, [
    "caseNoteActionId",
    "actionTakenAt",
    "notes"
  ]);
  const newAuditFeatureToggle = checkFeatureToggleEnabled(
    request,
    "newAuditFeature"
  );

  const caseNotes = await models.sequelize.transaction(async transaction => {
    const queryOptions = {
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: request.nickname
    };

    await models.case_note.update(valuesToUpdate, queryOptions);

    if (newAuditFeatureToggle) {
      const auditDetails = {};
      generateAndAddAuditDetailsFromQuery(
        auditDetails,
        queryOptions,
        models.case_note.name
      );

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        auditDetails,
        transaction
      );
    } else {
      await legacyAuditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        transaction
      );
    }

    return await models.case_note.findAll({
      where: { caseId },
      include: [{ model: models.case_note_action, as: "caseNoteAction" }],
      transaction
    });
  });

  response.status(200).send(caseNotes);
});

module.exports = editCaseNote;
