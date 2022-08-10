import Case from "../../sharedTestHelpers/case";
import CaseNote from "../testHelpers/caseNote";
import models from "../policeDataManager/models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import CaseNoteAction from "../testHelpers/caseNoteAction";

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

    const caseNoteAction = await models.case_note_action.create(
      new CaseNoteAction.Builder().defaultCaseNoteAction()
    );

    const caseNoteAttributes = new CaseNote.Builder()
      .defaultCaseNote()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withCaseNoteActionId(caseNoteAction.id);
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

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(caseNote.id);
    expect(audit.user).toEqual("someone");
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      {
        Action: caseNoteAction.name
      }
    ]);
    expect(audit.managerType).toEqual("complaint");
  });
});
