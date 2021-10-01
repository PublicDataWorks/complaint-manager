import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import CaseNote from "../testHelpers/caseNote";
import Notification from "../testHelpers/notification";
import Case from "../../sharedTestHelpers/case";
import models from "../policeDataManager/models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";

describe("dataChangeAuditHooks for notification", () => {
  let caseNote, existingCase, existingNotification;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });
    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withId(undefined)
      .withCaseId(existingCase.id);
    caseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "someone"
    });

    const existingNotificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(caseNote.id);

    existingNotification = await models.notification.create(
      existingNotificationAttributes,
      { auditUser: "someone" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("creates audit on notification creation", async () => {
    const notificationAttributes = new Notification.Builder()
      .defaultNotification()
      .withCaseNoteId(caseNote.id);

    const notification = await models.notification.create(
      notificationAttributes,
      { auditUser: "someone" }
    );

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "notification",
            modelId: notification.id
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      { "Notification Mentioned User": notification.user }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });

  test("creates audit on notification update", async () => {
    existingNotification.changed("user", true);

    await existingNotification.save({ auditUser: "someone" });

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "notification",
            modelId: existingNotification.id
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      { "Notification Mentioned User": existingNotification.user }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });

  test("creates audit on notification deletion", async () => {
    await existingNotification.destroy({ auditUser: "someone" });

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_DELETED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "notification",
            modelId: existingNotification.id
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      { "Notification Mentioned User": existingNotification.user }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });
});
