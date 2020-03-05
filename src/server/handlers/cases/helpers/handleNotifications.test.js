import Case from "../../../../client/complaintManager/testUtilities/case";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import models from "../../../complaintManager/models";
import CaseNote from "../../../../client/complaintManager/testUtilities/caseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { handleNotifications } from "./handleNotifications";
import * as httpMocks from "node-mocks-http";
import moment from "moment/moment";
import auditDataAccess from "../../audits/auditDataAccess";
import {
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../../sharedUtilities/constants";

jest.mock("../../audits/auditDataAccess");

describe("case note helpers", function() {
  let mentionedUsers = [],
    createdCase,
    createdCaseNote,
    allNotifications,
    request;
  const actionTaken = moment();

  beforeEach(async () => {
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
      .build();

    createdCaseNote = await models.case_note.create(caseNoteToCreate, {
      auditUser: "someone"
    });

    allNotifications = await models.notification.findAll({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { actionTakenAt: actionTaken, notes: "wow", mentionedUsers: [] },
      params: {
        caseId: createdCase.id
      },
      nickname: "TEST_USER_NICKNAME"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should do nothing and no audit", async () => {
    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const notifications = await models.notification.findAll({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    expect(auditDataAccess).not.toHaveBeenCalledWith(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.NOTIFICATIONS,
      {
        notification: {
          attributes: Object.keys(models.notification.rawAttributes),
          model: models.notification.name
        }
      }
    );

    expect(notifications).toBeEmpty();
  });

  test("should create notification and audit", async () => {
    const newUser = { label: "Syd Botz", value: "some1@some.com" };
    mentionedUsers.push(newUser);

    expect(allNotifications).toBeEmpty();

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    let allNewNotifications = await models.notification.findAll({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    expect(allNewNotifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          caseNoteId: createdCaseNote.id,
          user: newUser.value
        })
      ])
    );

    expect(auditDataAccess).toHaveBeenCalledWith(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.NOTIFICATIONS,
      {
        notification: {
          attributes: Object.keys(models.notification.rawAttributes),
          model: models.notification.name
        }
      },
      expect.anything()
    );
  });

  test("should update notification and audit", async () => {
    const newUser = { label: "Sean Rutledge", value: "some2@some.com" };
    mentionedUsers.push(newUser);

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const notification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const updatedNotification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    expect(updatedNotification).toEqual(
      expect.objectContaining({
        caseNoteId: notification.caseNoteId,
        user: notification.user
      })
    );

    expect(updatedNotification).not.toEqual(
      expect.objectContaining({ updatedAt: notification.updatedAt })
    );

    expect(auditDataAccess).toHaveBeenCalledWith(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.NOTIFICATIONS,
      {
        notification: {
          attributes: Object.keys(models.notification.rawAttributes),
          model: models.notification.name
        }
      },
      expect.anything()
    );
  });

  test("should delete notification and audit", async () => {
    const newUser = { label: "Wanchen Yao", value: "some3@some.com" };
    mentionedUsers.push(newUser);

    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const notification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: newUser.value
      }
    });

    mentionedUsers.pop();
    await models.sequelize.transaction(async transaction => {
      await handleNotifications(
        transaction,
        request,
        mentionedUsers,
        createdCaseNote.id
      );
    });

    const deletedNotification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: newUser.value
      },
      paranoid: false
    });

    expect(deletedNotification).toEqual(
      expect.objectContaining({
        caseNoteId: notification.caseNoteId,
        user: notification.user
      })
    );

    expect(deletedNotification).not.toEqual(
      expect.objectContaining({ deletedAt: null })
    );

    expect(auditDataAccess).toHaveBeenCalledWith(
      request.nickname,
      request.params.caseId,
      MANAGER_TYPE.COMPLAINT,
      AUDIT_SUBJECT.NOTIFICATIONS,
      {
        notification: {
          attributes: Object.keys(models.notification.rawAttributes),
          model: models.notification.name
        }
      },
      expect.anything()
    );
  });
});
