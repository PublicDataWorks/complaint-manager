import checkFeatureToggleEnabled from "../../../checkFeatureToggleEnabled";
import legacyAuditDataAccess from "../../legacyAuditDataAccess";
import auditDataAccess from "../../auditDataAccess";
import getQueryAuditAccessDetails from "../../getQueryAuditAccessDetails";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../models");
const _ = require("lodash");

const editCaseNote = asyncMiddleware(async (request, response, next) => {
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
      const caseNoteAuditDetails = getQueryAuditAccessDetails(
        queryOptions,
        models.case_note.name
      );

      await auditDataAccess(
        request.nickname,
        caseId,
        AUDIT_SUBJECT.CASE_NOTES,
        caseNoteAuditDetails,
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
