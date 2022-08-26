import moment, { utc } from "moment";
import Case from "../../../sharedTestHelpers/case";
import CaseNote from "../../testHelpers/caseNote";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import Notification from "../../testHelpers/notification";
import { getNotifications, extractNotifications } from "./getNotifications";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import Civilian from "../../../sharedTestHelpers/civilian";
import winston from "winston";

const models = require("../../policeDataManager/models");
const httpMocks = require("node-mocks-http");
const auth0UserService = require("../../services/auth0UserService");

jest.mock("../../services/auth0UserService", () => ({
  getUsers: jest.fn(() => {
    return [
      { name: "wancheny", email: "wancheny@gmail.com" },
      { name: "random", email: "random@gmail.com" },
      { name: "johnsmith", email: "johnsmith@gmail.com" },
      { name: "dogpower", email: "dogpower@gmail.com" }
    ];
  })
}));

describe("getNotifications", () => {
  let timestamp, currentCase, currentCaseNote, currentNotif;

  beforeEach(async () => {
    timestamp = utc().toDate();

    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

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
      .withHasBeenRead(true)
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
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return notification to user that was mentioned", async () => {
    const notifications = await getNotifications(timestamp, currentNotif.user);

    expect(notifications).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com"
      })
    ]);
  });

  test("should not return read notifications that were updated or created before timestamp", async () => {
    const currentTimezone = moment().format("ZZ");
    winston.log("info", `Current Timezone ${currentTimezone}`);

    const newTimestamp = utc().toDate();
    winston.log("info", `New Timestamp ${newTimestamp}`);

    const unreadNotificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withHasBeenRead(false)
      .withUser("seanrut@gmail.com");

    await models.notification.create(unreadNotificationAttributes, {
      auditUser: "tuser"
    });

    const readNotificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withHasBeenRead(true)
      .withUser("seanrut@gmail.com");

    await models.notification.create(readNotificationAttributes, {
      auditUser: "tuser"
    });

    const newNotifs = await getNotifications(newTimestamp, "seanrut@gmail.com");

    expect(newNotifs).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com",
        hasBeenRead: false
      }),
      expect.objectContaining({
        user: "seanrut@gmail.com",
        hasBeenRead: true
      })
    ]);

    expect(newNotifs).toHaveLength(2);
  });

  test("should return unread notifications that were updated or created before timestamp", async () => {
    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withHasBeenRead(false)
      .withUser("seanrut@gmail.com");

    const newNotif = await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    const currentTimezone = moment().format("ZZ");
    winston.log("info", `Current Timezone ${currentTimezone}`);

    const newTimestamp = utc().toDate();
    winston.log("info", `New Timestamp ${newTimestamp}`);

    const newNotifs = await getNotifications(newTimestamp, newNotif.user);

    expect(newNotifs).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com"
      })
    ]);

    expect(newNotifs).toHaveLength(1);
  });

  test("when user is mentioned more than once, user should receive all pertaining notifications", async () => {
    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withUser("seanrut@gmail.com");

    await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    const notifications = await getNotifications(timestamp, currentNotif.user);

    expect(notifications).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com"
      }),
      expect.objectContaining({
        user: "seanrut@gmail.com"
      })
    ]);

    expect(notifications).toHaveLength(2);
  });

  test("when user details are not returned from auth0, user should receive notification with only email", async () => {
    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withUser("author@gmail.com")
      .withCaseId(currentCase.id);

    currentCaseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "tuser"
    });

    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(currentCaseNote.id)
      .withHasBeenRead(false)
      .withUser("seanrut@gmail.com");

    const newNotif = await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    const notifications = await getNotifications(timestamp, newNotif.user);

    expect(notifications[0].author.name).toEqual("");
    expect(notifications[0].author.email).toEqual("author@gmail.com");
  });

  test("should call getUsers when getting notifications", async () => {
    await getNotifications(timestamp, currentNotif.user);

    expect(auth0UserService.getUsers).toHaveBeenCalled();
  });

  test("when notification is deleted, user should not receive the notification", async () => {
    await currentNotif.destroy({ auditUser: "tuser" });

    const notifications = await getNotifications(timestamp, currentNotif.user);

    expect(notifications).toEqual([]);
  });

  test("should return correct author for notification", async () => {
    const notifications = await getNotifications(timestamp, currentNotif.user);

    expect(notifications[0].author.name).toEqual("wancheny");
  });

  test("should return correct case reference for notification", async () => {
    const notifications = await getNotifications(timestamp, currentNotif.user);

    expect(notifications[0].caseReference).toEqual("AC2017-0001");
  });

  test("should return correct case reference for notification when case is archived", async () => {
    await models.cases.destroy({
      where: { id: currentCase.id },
      auditUser: "tuser"
    });

    const notifications = await getNotifications(timestamp, currentNotif.user);

    expect(notifications[0].caseReference).toEqual("AC2017-0001");
  });

  test("getNotifications called correctly from exractNotifications", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { user: currentNotif.user },
      query: { timestamp: timestamp },
      nickname: "tuser"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await extractNotifications(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        user: "seanrut@gmail.com"
      })
    ]);
  });

  describe("sorting notifications", () => {
    const generateNotification = async (author, hasBeenRead) => {
      const caseNoteAttributes = new CaseNote.Builder()
        .defaultCaseNote()
        .withUser(author)
        .withCaseId(currentCase.id);

      currentCaseNote = await models.case_note.create(caseNoteAttributes, {
        auditUser: "tuser"
      });

      const notificationAttributes = new Notification.Builder()
        .defaultNotification()
        .withCaseNoteId(currentCaseNote.id)
        .withHasBeenRead(hasBeenRead)
        .withUser("seanrut@gmail.com");

      await models.notification.create(notificationAttributes, {
        auditUser: "tuser"
      });
    };

    beforeEach(async () => {
      await currentNotif.destroy({ auditUser: "tuser" });
    });

    afterEach(async () => {
      await cleanupDatabase();
    });

    test("should return notifications in descending order by updated at timestamp", async () => {
      await generateNotification("wancheny@gmail.com", false);
      await generateNotification("johnsmith@gmail.com", false);
      await generateNotification("dogpower@gmail.com", false);

      const notifications = await getNotifications(
        timestamp,
        "seanrut@gmail.com"
      );

      expect(notifications).toEqual([
        expect.objectContaining({
          author: { name: "dogpower", email: "dogpower@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "johnsmith", email: "johnsmith@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "wancheny", email: "wancheny@gmail.com" }
        })
      ]);
    });

    test("should return all unread notifications before read notifications", async () => {
      await generateNotification("wancheny@gmail.com", false);
      await generateNotification("johnsmith@gmail.com", true);

      const notifications = await getNotifications(
        timestamp,
        "seanrut@gmail.com"
      );

      expect(notifications).toEqual([
        expect.objectContaining({
          author: { name: "wancheny", email: "wancheny@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "johnsmith", email: "johnsmith@gmail.com" }
        })
      ]);
    });

    test("should prioritize unread/read sorting over updated at timestamp sorting", async () => {
      await generateNotification("wancheny@gmail.com", false);
      await generateNotification("johnsmith@gmail.com", true);
      await generateNotification("dogpower@gmail.com", true);
      await generateNotification("random@gmail.com", false);

      const notifications = await getNotifications(
        timestamp,
        "seanrut@gmail.com"
      );

      expect(notifications).toEqual([
        expect.objectContaining({
          author: { name: "random", email: "random@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "wancheny", email: "wancheny@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "dogpower", email: "dogpower@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "johnsmith", email: "johnsmith@gmail.com" }
        })
      ]);
    });
  });

  describe("auditing", () => {
    test("should audit accessing notifications", async () => {
      await getNotifications(timestamp, "seanrut@gmail.com");

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
          user: "seanrut@gmail.com",
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
