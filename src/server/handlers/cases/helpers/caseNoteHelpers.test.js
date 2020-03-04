import Case from "../../../../client/complaintManager/testUtilities/case";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import models from "../../../complaintManager/models";
import CaseNote from "../../../../client/complaintManager/testUtilities/caseNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { handleNotifications } from "./caseNoteHelpers";

describe("case note helpers", function() {
  let mentionedUsers = [],
    createdCase,
    createdCaseNote,
    allNotifications;

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
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should create notification", async () => {
    const newUser = { label: "Syd Botz", value: "some1@some.com" };
    mentionedUsers.push(newUser);

    expect(allNotifications).toBeEmpty();

    await handleNotifications(mentionedUsers, createdCaseNote.id);

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
  });

  test("should update notification", async () => {
    const newUser = { label: "Sean Rutledge", value: "some2@some.com" };
    mentionedUsers.push(newUser);

    await handleNotifications(mentionedUsers, createdCaseNote.id);

    const notification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id
      }
    });

    await handleNotifications(mentionedUsers, createdCaseNote.id);

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
  });

  test("should delete notification", async () => {
    const newUser = { label: "Wanchen Yao", value: "some3@some.com" };
    mentionedUsers.push(newUser);

    await handleNotifications(mentionedUsers, createdCaseNote.id);

    const notification = await models.notification.findOne({
      where: {
        caseNoteId: createdCaseNote.id,
        user: newUser.value
      }
    });

    mentionedUsers.pop();
    await handleNotifications(mentionedUsers, createdCaseNote.id);

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
  });
});
