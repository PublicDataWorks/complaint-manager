import Case from "../../../sharedTestHelpers/case";
import CaseNote from "../../testHelpers/caseNote";
import Notification from "../../testHelpers/notification";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getNotificationStatus from "./getNotificationStatus";
const models = require("../../policeDataManager/models");
const httpMocks = require("node-mocks-http");

describe("getNotificationStatus", () => {
  let request, response, next, currentCaseNote, currentNotif, currentCase;

  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const caseAttributes = new Case.Builder().defaultCase();

    currentCase = await models.cases.create(caseAttributes, {
      auditUser: "tuser"
    });

    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id);

    currentNotif = await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        caseNoteId: currentCaseNote.id,
        notificationId: currentNotif.id
      },
      nickname: "tuser"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return false for caseNoteExists and notificationExists when case note does not exist", async () => {
    await models.case_note.destroy({
      where: { id: currentCaseNote.id },
      auditUser: "tuser"
    });

    await getNotificationStatus(request, response, next);

    expect(response._getData()).toEqual({
      caseNoteExists: false,
      notificationExists: false
    });
  });

  test("should return false for notificationExists when notification does not exist but case note does exist", async () => {
    await currentNotif.destroy({ auditUser: "tuser" });

    await getNotificationStatus(request, response, next);

    expect(response._getData()).toEqual({
      caseNoteExists: true,
      notificationExists: false
    });
  });

  test("should return true for notificationExists and caseNoteExists when both exist", async () => {
    await getNotificationStatus(request, response, next);

    expect(response._getData()).toEqual({
      caseNoteExists: true,
      notificationExists: true
    });
  });
});
