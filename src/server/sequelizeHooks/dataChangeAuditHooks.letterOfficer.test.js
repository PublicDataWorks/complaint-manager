import Case from "../../client/testUtilities/case";
import models from "../models";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import LetterOfficer from "../../client/testUtilities/LetterOfficer";
import Officer from "../../client/testUtilities/Officer";
import CaseOfficer from "../../client/testUtilities/caseOfficer";

describe("dataChangeAuditHooks for letter officer", () => {
  let existingCase, letterOfficer;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);
    const officer = await models.officer.create(officerAttributes, {
      auditUser: "someone"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withOfficerId(officer.id);
    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      {
        auditUser: "someone"
      }
    );

    const letterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(caseOfficer.id);
    letterOfficer = await models.letter_officer.create(
      letterOfficerAttributes,
      {
        auditUser: "someone"
      }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("creates audit on creation of letter officer", async () => {
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "letter_officer"
          }
        }
      ]
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      { "Officer Name": "Grant M Young" }
    ]);
    expect(audit.dataChangeAudit.modelId).toEqual(letterOfficer.id);
    expect(audit.user).toEqual("someone");
  });
});
