import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import models from "../../../policeDataManager/models";
import {
  AUDIT_SUBJECT,
  CASE_STATUS,
  MANAGER_TYPE,
  USER_PERMISSIONS
} from "../../../../sharedUtilities/constants";
import createCaseNote from "./createCaseNote";
import * as httpMocks from "node-mocks-http";
import moment from "moment";
import auditDataAccess from "../../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../../testHelpers/expectedAuditDetails";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import Boom from "boom";
import { addAuthorDetailsToCaseNote } from "../helpers/addAuthorDetailsToCaseNote";
import { sendNotification } from "../getMessageStream";

jest.mock("../../audits/auditDataAccess");

jest.mock("../helpers/addAuthorDetailsToCaseNote", () => ({
  addAuthorDetailsToCaseNote: jest.fn(caseNotes => {
    return caseNotes;
  })
}));

jest.mock("../getMessageStream", () => ({
  sendNotification: jest.fn()
}));

describe("createCaseNote", function () {
  let createdCase, request, response, next;
  const actionTaken = moment();
  response = httpMocks.createResponse();
  next = jest.fn();

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
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

    const caseActionTaken = await models.case_note_action.create({
      name: "test action"
    });

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: {
        actionTakenAt: actionTaken,
        notes: "wow",
        mentionedUsers: [],
        caseNoteActionId: { value: caseActionTaken.dataValues.id }
      },
      params: {
        caseId: createdCase.id
      },
      nickname: "TEST_USER_NICKNAME",
      permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
    });
  });

  describe("create a case note", () => {
    test("should create a case note", async () => {
      await createCaseNote(request, response, next);
      const caseNote = await models.case_note.findOne();
      const notification = await models.notification.findOne({
        where: { caseNoteId: caseNote.id }
      });

      expect(caseNote).toEqual(
        expect.objectContaining({
          caseId: createdCase.id,
          notes: "wow"
        })
      );

      expect(notification).toBeNull();
    });

    test("should create a case note with a notification", async () => {
      const mentionedUsers = [{ label: "Test", value: "test@test.com" }];
      request.body = {
        ...request.body,
        notes: "Sup @Test",
        mentionedUsers
      };
      await createCaseNote(request, response, next);
      const caseNote = await models.case_note.findOne({
        where: {
          notes: "Sup @Test"
        }
      });

      const notification = await models.notification.findOne({
        where: { caseNoteId: caseNote.id }
      });

      expect(notification).toEqual(
        expect.objectContaining({
          user: "test@test.com"
        })
      );
      expect(sendNotification).toHaveBeenCalledWith("test@test.com");
    });

    test("should throw error if error in mentionedUsers list", async () => {
      const mentionedUsers = [{ label: "Test", value: undefined }];
      request.body = {
        ...request.body,
        notes: "Sup @Test",
        mentionedUsers
      };
      await createCaseNote(request, response, next);

      expect(next).toHaveBeenCalledWith(
        Boom.badData(BAD_REQUEST_ERRORS.NOTIFICATION_CREATION_ERROR)
      );
    });

    test("should call addAuthorDetailsToCaseNote", async () => {
      await createCaseNote(request, response, next);

      expect(addAuthorDetailsToCaseNote).toHaveBeenCalled();
    });

    test("should create case notes and a new case note action", async () => {
      const localRequest = httpMocks.createRequest({
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: {
          caseId: createdCase.id
        },
        body: {
          ...request.body,
          caseNoteActionId: {
            value: "action-taken-test",
            label: "action-taken-test"
          }
        },
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.VIEW_ANONYMOUS_DATA
      });

      await createCaseNote(localRequest, response, next);

      const caseNotes = await models.case_note.findAll({
        where: { caseId: createdCase.id },
        include: [{ model: models.case_note_action, as: "caseNoteAction" }]
      });

      const caseNoteActionObj = caseNotes
        .map(note => note.caseNoteAction)
        .find(action => action.name === "action-taken-test");

      expect(caseNoteActionObj).toEqual(
        expect.objectContaining({
          name: "action-taken-test",
          id: expect.anything(),
          createdAt: expect.anything(),
          updatedAt: expect.anything()
        })
      );
    });
  });

  describe("auditing", () => {
    test("should audit case note accessed", async () => {
      await createCaseNote(request, response, next);

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

    test("should audit case details accessed", async () => {
      await createCaseNote(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });
});
