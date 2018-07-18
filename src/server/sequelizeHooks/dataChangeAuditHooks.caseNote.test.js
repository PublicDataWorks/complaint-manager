import Case from "../../client/testUtilities/case";
import CaseNote from "../../client/testUtilities/caseNote";
import models from "../models";
import { AUDIT_ACTION, TIMEZONE } from "../../sharedUtilities/constants";
import timezone from "moment-timezone";

describe("dataChangeAuditHooks for caseNote", () => {
  afterEach(async () => {
    await models.cases.truncate({ cascade: true, auditUser: true });
    await models.data_change_audit.truncate();
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

    const audit = await models.data_change_audit.find({
      where: { modelName: "Case Note", action: AUDIT_ACTION.DATA_CREATED }
    });

    const formattedActionTakenAt = timezone
      .tz(caseNote.actionTakenAt, TIMEZONE)
      .format("MMM DD, YYYY h:mm:ss A z");

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(caseNote.id);
    expect(audit.user).toEqual("someone");
    expect(audit.modelDescription).toEqual([
      {
        Action: caseNote.action
      },
      {
        "Action Taken At": formattedActionTakenAt
      }
    ]);
  });
});
