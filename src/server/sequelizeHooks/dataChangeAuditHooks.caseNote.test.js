import Case from "../../sharedTestHelpers/case";
import CaseNote from "../testHelpers/caseNote";
import models from "../policeDataManager/models";
import { AUDIT_ACTION, TIMEZONE } from "../../sharedUtilities/constants";
import timezone from "moment-timezone";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";

describe("dataChangeAuditHooks for caseNote", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("creates audit on caseNote creation", async () => {
    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined);
    const existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });
    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withId(undefined)
      .withCaseId(existingCase.id);
    const caseNote = await models.case_note.create(caseNoteAttributes, {
      auditUser: "someone"
    });

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "case_note"
          }
        }
      ]
    });

    const formattedActionTakenAt = timezone
      .tz(caseNote.actionTakenAt, TIMEZONE)
      .format("MMM DD, YYYY h:mm:ss A z");

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(caseNote.id);
    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      {
        Action: caseNote.action
      },
      {
        "Action Taken At": formattedActionTakenAt
      }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });
});
