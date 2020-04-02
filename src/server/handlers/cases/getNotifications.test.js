import CaseNote from "../../../client/complaintManager/testUtilities/caseNote";
import Case from "../../../client/complaintManager/testUtilities/case";
import Notification from "../../../client/complaintManager/testUtilities/notification";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getNotifications from "./getNotifications";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import moment, { now, utc } from "moment";
const models = require("../../complaintManager/models");
const httpMocks = require("node-mocks-http");

describe("getNotifications", () => {
  let request,
    response,
    next,
    currentCaseNote,
    currentNotif,
    timestamp,
    currentCase;

  beforeEach(async () => {
    timestamp = utc().toDate();
    const caseAttributes = new Case.Builder().defaultCase();
    currentCase = await models.cases.create(caseAttributes, {
      auditUser: "tuser"
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

    const otherNotificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withUser("veronica@gmail.com");

    await models.notification.create(otherNotificationAttributes, {
      auditUser: "tuser"
    });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { user: currentNotif.user },
      query: { timestamp: timestamp },
      nickname: "tuser"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should return notification to user that was mentioned", async () => {
    await getNotifications(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com"
      })
    ]);
  });

  test("should not return notifications that were updated or created before timestamp", async () => {
    console.log("Current Timezone", moment().format("ZZ"));

    request.query.timestamp = utc().toDate();
    console.log("Request Timestamp", request.query.timestamp);

    console.log("Request", request);
    const anotherRequest = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { user: currentNotif.user },
      query: { timestamp: request.query.timestamp },
      nickname: "tuser"
    });
    console.log("Another Request", anotherRequest);

    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withUser("seanrut@gmail.com");

    await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    await getNotifications(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com"
      })
    ]);
  });

  test("when user is mentioned more than once, user should receive all pertaining notifications", async () => {
    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withUser("seanrut@gmail.com");

    await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    await getNotifications(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com"
      }),
      expect.objectContaining({
        user: "seanrut@gmail.com"
      })
    ]);
  });

  test("when notification is deleted, user should not receive the notification", async () => {
    await currentNotif.destroy({ auditUser: "tuser" });

    await getNotifications(request, response, next);

    expect(response._getData()).toEqual([]);
  });

  test("should return correct case reference for notification", async () => {
    const caseReference = currentCase.caseReference;

    await getNotifications(request, response, next);

    expect(response._getData()[0].caseReference).toEqual(caseReference);
  });

  test("should return correct mentioner for notification", async () => {
    const mentioner = currentCaseNote.user;

    await getNotifications(request, response, next);

    expect(response._getData()[0].mentioner).toEqual(mentioner);
  });

  test("should return correct case reference for notification when case is archived", async () => {
    await models.cases.destroy({
      where: { id: currentCase.id },
      auditUser: "tuser"
    });

    const archivedCase = await models.cases.findByPk(currentCase.id, {
      paranoid: false
    });

    await getNotifications(request, response, next);

    expect(response._getData()[0].caseReference).toEqual(
      archivedCase.caseReference
    );
  });

  describe("auditing", () => {
    test("should audit accessing notifications", async () => {
      await getNotifications(request, response, next);

      const audit = await models.audit.findOne({
        where: {
          referenceId: null,
          auditAction: AUDIT_ACTION.DATA_ACCESSED
        },
        include: [
          {
            model: models.data_access_audit,
            as: "dataAccessAudit",
            include: [
              {
                model: models.data_access_value,
                as: "dataAccessValues"
              }
            ]
          }
        ]
      });

      expect(audit).toEqual(
        expect.objectContaining({
          user: "tuser",
          auditAction: AUDIT_ACTION.DATA_ACCESSED,
          referenceId: null,
          managerType: "complaint",
          dataAccessAudit: expect.objectContaining({
            auditSubject: AUDIT_SUBJECT.NOTIFICATIONS,
            dataAccessValues: expect.arrayContaining([
              expect.objectContaining({
                association: "notification",
                fields: expect.arrayContaining(
                  Object.keys(models.notification.rawAttributes)
                )
              })
            ])
          })
        })
      );
    });
  });
});
