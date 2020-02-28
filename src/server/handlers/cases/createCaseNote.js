import { getCaseWithAllAssociationsAndAuditDetails } from "../getCaseHelpers";
import auditDataAccess from "../audits/auditDataAccess";
import getQueryAuditAccessDetails from "../audits/getQueryAuditAccessDetails";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import { createNotification } from "./helpers/caseNoteHelpers";

const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../sharedUtilities/constants");
const asyncMiddleware = require("../asyncMiddleware");
const models = require("../../complaintManager/models");

const createCaseNote = asyncMiddleware(async (request, response, next) => {
  const currentCase = await models.sequelize.transaction(async transaction => {
    const { mentionedUsers, ...requestBody } = request.body;
    const mentioner = request.nickname;
    let caseNoteId = null;
    await models.case_note
      .create(
        {
          ...requestBody,
          user: mentioner,
          caseId: request.params.caseId
        },
        {
          transaction,
          auditUser: mentioner
        }
      )
      .then(data => {
        caseNoteId = data.dataValues.id;
      });

    await createNotification(mentionedUsers, requestBody, caseNoteId).catch(
      () => {
        throw Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_CREATION_ERROR);
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
