import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { isCaseNoteAuthor } from "../helpers/isCaseNoteAuthor";
import { addAuthorDetailsToCaseNote } from "../helpers/addAuthorDetailsToCaseNote";
import { sendNotification } from "../getMessageStream";

const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models");

const removeCaseNote = asyncMiddleware(async (request, response, next) => {
  const caseId = request.params.caseId;
  const caseNoteId = request.params.caseNoteId;

  const operationsPermitted = await isCaseNoteAuthor(
    request.nickname,
    caseNoteId
  );
  if (!operationsPermitted)
    throw Boom.badRequest(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED);

  const currentCase = await models.sequelize.transaction(async transaction => {
    const notifs = await models.notification.findAll({
      where: { caseNoteId: caseNoteId },
      attributes: ["user"]
    });
    const usersWithNotifs = notifs.map(notif => {
      return notif.get("user");
    });

    await models.notification
      .destroy({
        where: {
          caseNoteId: caseNoteId
        },
        transaction,
        auditUser: request.nickname
      })
      .catch(() => {
        throw Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_DELETION_ERROR);
      });

    await models.case_note.destroy({
      where: {
        id: caseNoteId
      },
      transaction,
      auditUser: request.nickname
    });

    const caseDetailsAndAuditDetails =
      await getCaseWithAllAssociationsAndAuditDetails(
        caseId,
        transaction,
        request.permissions
      );
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;
    const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;

    const caseNotesQueryOptions = {
      where: { caseId },
      transaction
    };
    const rawCaseNotes = await models.case_note.findAll(caseNotesQueryOptions);
    const caseNotes = await addAuthorDetailsToCaseNote(rawCaseNotes);

    const caseNotesAuditDetails = getQueryAuditAccessDetails(
      caseNotesQueryOptions,
      models.case_note.name
    );

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      caseAuditDetails,
      transaction
    );

    await auditDataAccess(
      request.nickname,
      caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      caseNotesAuditDetails,
      transaction
    );

    return {
      caseDetails,
      caseNotes,
      usersWithNotifs
    };
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

  response.status(200).send({
    caseNotes: currentCase.caseNotes,
    caseDetails: currentCase.caseDetails
  });

  for (const user in currentCase.usersWithNotifs) {
    const userWithNotif = currentCase.usersWithNotifs[user];
    await sendNotification(userWithNotif);
  }
});

module.exports = removeCaseNote;
