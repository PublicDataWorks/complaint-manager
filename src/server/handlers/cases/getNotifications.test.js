import CaseNote from "../../../client/complaintManager/testUtilities/caseNote";
import Case from "../../../client/complaintManager/testUtilities/case";
import Notification from "../../../client/complaintManager/testUtilities/notification";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getNotifications from "./getNotifications";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT
} from "../../../sharedUtilities/constants";
import moment, { utc } from "moment";
import Civilian from "../../../client/complaintManager/testUtilities/civilian";
const models = require("../../complaintManager/models");
const httpMocks = require("node-mocks-http");
const auth0UserServices = require("../../services/auth0UserServices");

jest.mock("../../services/auth0UserServices", () => ({
  getUsersFromAuth0: jest.fn(() => {
    return [
      { name: "wancheny", email: "wancheny@gmail.com" },
      { name: "random", email: "random@gmail.com" },
      { name: "johnsmith", email: "johnsmith@gmail.com" },
      { name: "catpower", email: "catpower@gmail.com" }
    ];
  })
}));

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

    await models.notification.create(notificationAttributes, {
      auditUser: "tuser"
    });

    await getNotifications(request, response, next);

    expect(response._getData()[0].author.name).toEqual("");
    expect(response._getData()[0].author.email).toEqual("author@gmail.com");
  });

  test("should call getUsersFromAuth0 when getting notifications", async () => {
    await getNotifications(request, response, next);

    expect(auth0UserServices.getUsersFromAuth0).toHaveBeenCalled();
  });

  test("when notification is deleted, user should not receive the notification", async () => {
    await currentNotif.destroy({ auditUser: "tuser" });

    await getNotifications(request, response, next);

    expect(response._getData()).toEqual([]);
  });

  test("should return correct case reference for notification", async () => {
    await getNotifications(request, response, next);

    expect(response._getData()[0].caseReference).toEqual("AC2017-0001");
  });

  test("should return correct author for notification", async () => {
    await getNotifications(request, response, next);

    expect(response._getData()[0].author.name).toEqual("wancheny");
  });

  test("should return correct case reference for notification when case is archived", async () => {
    await models.cases.destroy({
      where: { id: currentCase.id },
      auditUser: "tuser"
    });

    await getNotifications(request, response, next);

    expect(response._getData()[0].caseReference).toEqual("AC2017-0001");
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
      await generateNotification("catpower@gmail.com", false);

      await getNotifications(request, response, next);

      expect(response._getData()).toEqual([
        expect.objectContaining({
          author: { name: "catpower", email: "catpower@gmail.com" }
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

      await getNotifications(request, response, next);

      expect(response._getData()).toEqual([
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
      await generateNotification("catpower@gmail.com", true);
      await generateNotification("random@gmail.com", false);

      await getNotifications(request, response, next);

      expect(response._getData()).toEqual([
        expect.objectContaining({
          author: { name: "random", email: "random@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "wancheny", email: "wancheny@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "catpower", email: "catpower@gmail.com" }
        }),
        expect.objectContaining({
          author: { name: "johnsmith", email: "johnsmith@gmail.com" }
        })
      ]);
    });
  });
});
