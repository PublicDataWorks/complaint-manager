import getQueryAuditAccessDetails from "../../audits/getQueryAuditAccessDetails";
import auditDataAccess from "../../audits/auditDataAccess";
import { addAuthorDetailsToCaseNote } from "../helpers/addAuthorDetailsToCaseNote";

const {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} = require("../../../../sharedUtilities/constants");
const asyncMiddleWare = require("../../asyncMiddleware");
const models = require("../../../policeDataManager/models/index");

/**
 * @swagger
 * /cases/:caseId/case-notes:
 *   get:
 *     tags:
 *      - case notes
 *     summary: Retrieve a list of notes from a case
 *     description: Returns a list of notes associated with the case.
 *     parameters:
 *      - name: caseId
 *        in: path
 *        description: Id of the case
 *        required: true
 *        type: integer
 *        example: 1
 *     responses:
 *       200:
 *         description: A list of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The note id
 *                         example: 1
 *                       notes:
 *                         type: string
 *                         description: notes
 *                         example: notes taken in the case
 *                       actionTakenAt:
 *                         type: string
 *                         description: ???
 *                         example: 2024-02-23T19:33:00.000Z
 *                       createdAt:
 *                         type: string
 *                         description: creation date
 *                         example: 2024-02-23T19:33:30.546Z
 *                       updatedAt:
 *                         type: string
 *                         description: creation date
 *                         example: 2024-02-23T19:33:30.546Z
 *                       deletedAt:
 *                         type: string
 *                         description: creation date
 *                         example: null
 *                       actionId:
 *                         type: int
 *                         description: creation date
 *                         example: 2
 *                       caseId:
 *                         type: int
 *                         description: creation date
 *                         example: 1
 *                       caseNoteActionId:
 *                         type: int
 *                         description: creation date
 *                         example: 1
 *                       caseNoteAction:
 *                         type: object
 *                         properties:
 *                          id:
 *                           type: integer
 *                          name:
 *                           type: string
 *                          createdAt:
 *                           type: string
 *                          updatedAt:
 *                           type: string
 *                         example:
 *                          id: 1
 *                          name: string
 *                          createdAt: 2024-02-22T20:04:30.682Z
 *                          updatedAt: 2024-02-22T20:04:30.682Z
 *                       author:
 *                         type: object
 *                         properties:
 *                          name:
 *                           type: string
 *                          email:
 *                           type: string
 *                         example:
 *                          name: string
 *                          email: email@email.com
 */

const retrieveCaseNotes = asyncMiddleWare(async (request, response) => {
  const rawCaseNotes = await models.sequelize.transaction(async transaction => {
    const caseNotesAndAuditDetails = await getAllCaseNotesAndAuditDetails(
      request.params.caseId,
      request.nickname,
      transaction
    );
    const allCaseNotes = caseNotesAndAuditDetails.caseNotes;
    const auditDetails = caseNotesAndAuditDetails.auditDetails;

    await auditDataAccess(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.CASE_NOTES,
      auditDetails,
      transaction
    );

    return allCaseNotes;
  });

  const caseNotes = await addAuthorDetailsToCaseNote(rawCaseNotes);

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
      console.error(err);
      // Transaction has been rolled back
      throw err;
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

module.exports = retrieveCaseNotes;
