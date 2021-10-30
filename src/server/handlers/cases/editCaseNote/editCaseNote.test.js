import * as httpMocks from "node-mocks-http";
import CaseNote from "../../../testHelpers/caseNote";
import models from "../../../policeDataManager/models";
import Case from "../../../../sharedTestHelpers/case";
import editCaseNote from "./editCaseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";
import auditDataAccess from "../../audits/auditDataAccess";
import Boom from "boom";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import { isCaseNoteAuthor } from "../helpers/isCaseNoteAuthor";
import { addAuthorDetailsToCaseNote } from "../helpers/addAuthorDetailsToCaseNote";
import { sendNotification } from "../getMessageStream";

jest.mock("../../audits/auditDataAccess");
jest.mock("../helpers/isCaseNoteAuthor");

jest.mock("../helpers/addAuthorDetailsToCaseNote", () => ({
  addAuthorDetailsToCaseNote: jest.fn(caseNotes => {
    return caseNotes;
  })
}));

jest.mock("../getMessageStream", () => ({
  sendNotification: jest.fn()
}));

describe("editCaseNote", function () {
  let createdCase,
    createdCaseNote,
    updatedCaseNote,
    caseNoteAction,
    newCaseNoteAction,
    request,
    response,
    next;

  response = httpMocks.createResponse();
  next = jest.fn();

  beforeEach(async () => {
    caseNoteAction = await models.case_note_action.create(
      { name: "some action" },
      { auditUser: "some user" }
    );
    newCaseNoteAction = await models.case_note_action.create(
      { name: "updated action" },
      { auditUser: "a different user" }
    );
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withStatus(CASE_STATUS.INITIAL)
      .withComplainantCivilians([])
      .withAttachments([])
      .withAccusedOfficers([])
      .withIncidentLocation(undefined)
      .build();

    createdCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });

    const caseNoteToCreate = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(createdCase.id)
      .withNotes("default notes")
      .withCaseNoteActionId(caseNoteAction.id)
      .build();

    createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    updatedCaseNote = {
      caseNoteActionId: newCaseNoteAction.id,
      notes: "updated notes",
      mentionedUsers: []
    };

    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseId: createdCase.id,
        caseNoteId: createdCaseNote.id
      },
      body: updatedCaseNote,
      nickname: "TEST_USER_NICKNAME"
    });

    isCaseNoteAuthor.mockReturnValue(true);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("only editing case notes when operations are permitted", () => {
    test("should return bad request response with not allowed message", async () => {
      isCaseNoteAuthor.mockReturnValue(false);

      await editCaseNote(request, response, next);

      expect(isCaseNoteAuthor).toHaveBeenCalledWith(
        request.nickname,
        createdCaseNote.id
      );
      expect(next).toHaveBeenCalledWith(
        Boom.badData(BAD_REQUEST_ERRORS.ACTION_NOT_ALLOWED)
      );
    });
  });

  describe("editing case note with no mentions yet", () => {
    test("should update case status and case notes in the db after case note edited", async () => {
      await editCaseNote(request, response, next);

      const updatedCase = await models.cases.findOne({
        where: { id: createdCase.id }
      });

      expect(updatedCase).toEqual(
        expect.objectContaining({
          status: CASE_STATUS.ACTIVE
        })
      );

      const updatedCaseNotes = await models.case_note.findAll({
        where: { caseId: createdCase.id },
        include: [{ model: models.case_note_action, as: "caseNoteAction" }]
      });
      const notification = await models.notification.findOne({
        where: { caseNoteId: updatedCaseNotes[0].id }
      });
      expect(updatedCaseNotes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: createdCaseNote.id,
            caseId: createdCaseNote.caseId,
            notes: updatedCaseNote.notes,
            caseNoteActionId: updatedCaseNote.caseNoteActionId,
            caseNoteAction: expect.objectContaining({
              id: newCaseNoteAction.id,
              name: newCaseNoteAction.name
            })
          })
        ])
      );
      expect(notification).toBeNull();
    });

    test("should create new notification when case notes edited with a new mention", async () => {
      updatedCaseNote.mentionedUsers = [
        { label: "Test", value: "test@test.com" }
      ];
      updatedCaseNote.notes += " @Test";

      await editCaseNote(request, response, next);

      const updatedCase = await models.cases.findOne({
        where: { id: createdCase.id }
      });

      expect(updatedCase).toEqual(
        expect.objectContaining({
          status: CASE_STATUS.ACTIVE
        })
      );

      const updatedCaseNotes = await models.case_note.findAll({
        where: { caseId: createdCase.id },
        include: [{ model: models.case_note_action, as: "caseNoteAction" }]
      });
      const notification = await models.notification.findOne({
        where: { caseNoteId: updatedCaseNotes[0].id }
      });
      expect(updatedCaseNotes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: createdCaseNote.id,
            caseId: createdCaseNote.caseId,
            notes: updatedCaseNote.notes,
            caseNoteActionId: updatedCaseNote.caseNoteActionId,
            caseNoteAction: expect.objectContaining({
              id: newCaseNoteAction.id,
              name: newCaseNoteAction.name
            })
          })
        ])
      );

      expect(notification).toEqual(
        expect.objectContaining({
          user: "test@test.com"
        })
      );

      expect(sendNotification).toHaveBeenCalledWith("test@test.com");
    });

    test("should throw error if error in mentionedUsers list", async () => {
      updatedCaseNote.mentionedUsers = [{ label: "Test", value: undefined }];

      request.body = updatedCaseNote;

      await editCaseNote(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_EDIT_ERROR)
      );
    });

    test("should call addAuthorDetailsToCaseNote", async () => {
      await editCaseNote(request, response, next);

      expect(addAuthorDetailsToCaseNote).toHaveBeenCalled();
    });
  });

  describe("editing case note already with mentions", () => {
    beforeEach(async () => {
      const caseNoteToCreate = new CaseNote.Builder()
        .defaultCaseNote()
        .withCaseId(createdCase.id)
        .withNotes("default notes @Test")
        .withCaseNoteActionId(caseNoteAction.id)
        .build();

      createdCaseNote = await models.case_note.create(caseNoteToCreate, {
        auditUser: "someone"
      });

      await models.notification.create(
        {
          user: "test@test.com",
          caseNoteId: createdCaseNote.id
        },
        { auditUser: "someone" }
      );

      updatedCaseNote = {
        caseNoteActionId: newCaseNoteAction.id,
        notes: "new notes @Test",
        mentionedUsers: [{ label: "Test", value: "test@test.com" }]
      };

      request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          caseId: createdCase.id,
          caseNoteId: createdCaseNote.id
        },
        body: updatedCaseNote,
        nickname: "TEST_USER_NICKNAME"
      });
    });

    test("should update previous notification with timestamp when case notes edited with same mention", async () => {
      const previousNotification = await models.notification.findAll({
        where: { caseNoteId: createdCaseNote.id }
      });

      const previousTimeStamp = previousNotification[0].updatedAt;

      await editCaseNote(request, response, next);

      const notification = await models.notification.findAll({
        where: { caseNoteId: createdCaseNote.id }
      });

      const currentTimeStamp = notification[0].updatedAt;

      expect(notification.length).toEqual(1);

      expect(previousTimeStamp).not.toEqual(currentTimeStamp);

      expect(sendNotification).toHaveBeenCalledWith("test@test.com");
    });

    test("should delete previous notification when user is no longer mentioned in case note", async () => {
      const previousNotification = await models.notification.findOne({
        where: { caseNoteId: createdCaseNote.id }
      });

      expect(previousNotification).toEqual(
        expect.objectContaining({
          user: "test@test.com"
        })
      );

      updatedCaseNote.mentionedUsers = [];
      updatedCaseNote.notes = "no one is mentioned here";

      request.body = updatedCaseNote;

      await editCaseNote(request, response, next);

      const notification = await models.notification.findAll({
        where: { caseNoteId: createdCaseNote.id }
      });

      expect(notification).toEqual([]);

      expect(sendNotification).toHaveBeenCalledWith("test@test.com");
    });
  });

  describe("auditing", () => {
    beforeEach(() => {
      request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          caseId: createdCase.id,
          caseNoteId: createdCaseNote.id
        },
        body: updatedCaseNote,
        nickname: "TEST_USER_NICKNAME"
      });
    });

    test("should audit when case note accessed through edit", async () => {
      await editCaseNote(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_NOTES,
        {
          caseNote: {
            attributes: Object.keys(models.case_note.rawAttributes),
            model: models.case_note.name
          },
          caseNoteAction: {
            attributes: Object.keys(models.case_note_action.rawAttributes),
            model: models.case_note_action.name
          }
        },
        expect.anything()
      );
    });
  });
});
