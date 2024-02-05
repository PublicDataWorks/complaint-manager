import { getCaseWithAllAssociationsAndAuditDetails } from "../../getCaseHelpers";
import auditDataAccess from "../../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import { handleNotifications } from "../helpers/handleNotifications";
import { addAuthorDetailsToCaseNote } from "../helpers/addAuthorDetailsToCaseNote";
import { sendNotification } from "../getMessageStream";
import { updateCaseToActiveIfInitial } from "../helpers/caseStatusHelpers";

const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");
const asyncMiddleware = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models");

const createCaseNote = asyncMiddleware(async (request, response, next) => {
  const currentCase = await models.sequelize.transaction(async transaction => {
    const { mentionedUsers, ...requestBody } = request.body;
    const author = request.nickname;
    let caseNoteId = null;

    const { caseNoteActionId } = requestBody;
    let caseNoteActionIdValue;
    if (typeof caseNoteActionId.value === "string") {
      try {
        const caseNoteAction = await models.case_note_action.create({
          name: caseNoteActionId.value
        });
        caseNoteActionIdValue = caseNoteAction.id;
      } catch (error) {
        console.error(
          "Error while creating a new case note action. Error: ",
          error
        );
        throw error;
      }
    } else {
      caseNoteActionIdValue = caseNoteActionId.value;
    }

    await models.case_note
      .create(
        {
          ...requestBody,
          user: author,
          caseId: request.params.caseId,
          caseNoteActionId: caseNoteActionIdValue
        },
        {
          transaction,
          auditUser: author
        }
      )
      .then(data => {
        caseNoteId = data.dataValues.id;
      });

    await updateCaseToActiveIfInitial(
      request.params.caseId,
      request.nickname,
      transaction
    );

    const usersWithNotifs = await handleNotifications(
      transaction,
      request,
      mentionedUsers,
      caseNoteId
    ).catch(() => {
      throw Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_CREATION_ERROR);
    });

    const caseNotesAndAuditDetails = await getCaseNotesAndAuditDetails(
      request.params.caseId,
      transaction
    );
    const rawCaseNotes = caseNotesAndAuditDetails.caseNotes;
    const caseNotes = await addAuthorDetailsToCaseNote(rawCaseNotes);
    const caseNoteAuditDetails = caseNotesAndAuditDetails.auditDetails;

    const caseDetailsAndAuditDetails =
      await getCaseWithAllAssociationsAndAuditDetails(
        request.params.caseId,
        transaction,
        request.permissions
      );
    const caseAuditDetails = caseDetailsAndAuditDetails.auditDetails;
    const caseDetails = caseDetailsAndAuditDetails.caseDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      caseNoteAuditDetails,
      transaction
    );

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_DETAILS,
      caseAuditDetails,
      transaction
    );
    return { caseNotes, caseDetails, usersWithNotifs };
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

  response.status(201).send({
    caseNotes: currentCase.caseNotes,
    caseDetails: await currentCase.caseDetails.toJSON()
  });

  for (const user in currentCase.usersWithNotifs) {
    const userWithNotif = currentCase.usersWithNotifs[user];
    await sendNotification(userWithNotif);
  }
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
