import auditDataAccess from "../../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import { MANAGER_TYPE } from "../../../../sharedUtilities/constants";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { handleNotifications } from "../helpers/handleNotifications";
import { isCaseNoteAuthor } from "../helpers/isCaseNoteAuthor";
import { addAuthorDetailsToCaseNote } from "../helpers/addAuthorDetailsToCaseNote";
import { sendNotification } from "../getMessageStream";

const { AUDIT_SUBJECT } = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../complaintManager/models");
const _ = require("lodash");

const editCaseNote = asyncMiddleware(async (request, response, next) => {
  const mentionedUsers = request.body.mentionedUsers;
  const caseId = request.params.caseId;
  const caseNoteId = request.params.caseNoteId;
  const valuesToUpdate = _.pick(request.body, [
    "caseNoteActionId",
    "actionTakenAt",
    "notes"
  ]);

  const operationsPermitted = await isCaseNoteAuthor(
    request.nickname,
    caseNoteId
  );
  if (!operationsPermitted)
    throw Boom.badRequest(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED);

  const caseNotes = await models.sequelize.transaction(async transaction => {
    await models.case_note.update(valuesToUpdate, {
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: request.nickname
    });

    const usersWithNotifs = await handleNotifications(
      transaction,
      request,
      mentionedUsers,
      caseNoteId
    ).catch(() => {
      throw Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_EDIT_ERROR);
    });

    const accessQueryOptions = {
      where: { caseId },
      include: [{ model: models.case_note_action, as: "caseNoteAction" }],
      transaction
    };

    const rawCaseNotes = await models.case_note.findAll(accessQueryOptions);
    const caseNotes = await addAuthorDetailsToCaseNote(rawCaseNotes);

    const caseNoteAuditDetails = getQueryAuditAccessDetails(
      accessQueryOptions,
      models.case_note.name
    );

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      caseNoteAuditDetails,
      transaction
    );

    return { caseNotes, usersWithNotifs };
  });

  await models.sequelize
    .transaction(async transaction => {
      await auditDataAccess(
        request.nickname,
        null,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.ALL_AUTHOR_DATA_FOR_CASE_NOTES,
        { users: { attributes: ["name", "email"] } },
        transaction
      );
    })
    .catch(err => {
      // Transaction has been rolled back
      throw err;
    });

  response.status(200).send([...caseNotes.caseNotes]);

  for (const user in caseNotes.usersWithNotifs) {
    const userWithNotif = caseNotes.usersWithNotifs[user];
    await sendNotification(userWithNotif);
  }
});

module.exports = editCaseNote;
