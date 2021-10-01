import Case from "../../sharedTestHelpers/case";
import models from "../policeDataManager/models";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import LetterOfficer from "../testHelpers/LetterOfficer";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import ReferralLetterOfficerHistoryNote from "../testHelpers/ReferralLetterOfficerHistoryNote";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";

describe("data change audit hooks for referral letter officer history note", () => {
  let officerHistoryNote, existingCase, caseOfficer;

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
    caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
      auditUser: "someone"
    });

    const letterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(caseOfficer.id);
    const letterOfficer = await models.letter_officer.create(
      letterOfficerAttributes,
      {
        auditUser: "someone"
      }
    );

    const officerHistoryNoteAttributes =
      new ReferralLetterOfficerHistoryNote.Builder()
        .defaultReferralLetterOfficerHistoryNote()
        .withReferralLetterOfficerId(letterOfficer.id)
        .withId(undefined);

    officerHistoryNote =
      await models.referral_letter_officer_history_note.create(
        officerHistoryNoteAttributes,
        { auditUser: "someone" }
      );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it creates an audit for creating an officer history note", async () => {
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "referral_letter_officer_history_note"
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(officerHistoryNote.id);
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      { "Officer Name": caseOfficer.fullName }
    ]);
    expect(audit.user).toEqual("someone");
    expect(audit.managerType).toEqual("complaint");
  });
});
