import Case from "../../sharedTestHelpers/case";
import Civilian from "../../sharedTestHelpers/civilian";
import CaseNote from "../testHelpers/caseNote";
import Notification from "../testHelpers/notification";
import { sendNotifsIfComplainantChange } from "./sendNotifsIfComplainantChange";
import { sendNotification } from "./cases/getMessageStream";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

jest.mock("./cases/getMessageStream", () => ({
  sendNotification: jest.fn()
}));

const models = require("../policeDataManager/models/index");

describe("send notifications to users mentioned in case", () => {
  let currentCase, currentCaseNote, currentNotif;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withComplainantCivilians([
        { ...new Civilian.Builder().defaultCivilian().withIsAnonymous(true) }
      ])
      .withComplainantOfficers([]);

    currentCase = await models.cases.create(caseAttributes, {
      auditUser: "tuser",
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "someone"
        }
      ]
    });

    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("wancheny@gmail.com")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withUser("seanrut@gmail.com");

    currentNotif = await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should send notifications to users only once", async () => {
    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("seanrut@gmail.com")
      .withCaseId(currentCase.id);

    const otherCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(otherCaseNote.id)
      .withUser("seanrut@gmail.com");

    await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    await sendNotifsIfComplainantChange(currentCase.id);

    expect(sendNotification).toHaveBeenCalledTimes(1);
  });

  test("should only notify users in this case", async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(1234)
      .withComplainantCivilians([])
      .withComplainantOfficers([]);

    const otherCase = await models.cases.create(caseAttributes, {
      auditUser: "tuser",
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        },
        {
          model: models.case_officer,
          as: "complainantOfficers",
          auditUser: "someone"
        }
      ]
    });

    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("seanrut@gmail.com")
      .withCaseId(otherCase.id);

    const otherCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(otherCaseNote.id)
      .withUser("sydbotz@gmail.com");

    await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    await sendNotifsIfComplainantChange(currentCase.id);

    expect(sendNotification).toHaveBeenCalledWith("seanrut@gmail.com");
    expect(sendNotification).not.toHaveBeenCalledWith("sydbotz@gmail.com");
  });
});
