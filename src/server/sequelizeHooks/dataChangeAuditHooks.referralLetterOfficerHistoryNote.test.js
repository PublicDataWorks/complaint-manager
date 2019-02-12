import Case from "../../client/testUtilities/case";
import models from "../models";
import Officer from "../../client/testUtilities/Officer";
import CaseOfficer from "../../client/testUtilities/caseOfficer";
import LetterOfficer from "../../client/testUtilities/LetterOfficer";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import ReferralLetterOfficerHistoryNote from "../../client/testUtilities/ReferralLetterOfficerHistoryNote";
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

    const officerHistoryNoteAttributes = new ReferralLetterOfficerHistoryNote.Builder()
      .defaultReferralLetterOfficerHistoryNote()
      .withReferralLetterOfficerId(letterOfficer.id)
      .withId(undefined);

    officerHistoryNote = await models.referral_letter_officer_history_note.create(
      officerHistoryNoteAttributes,
      { auditUser: "someone" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it creates an audit for creating an officer history note", async () => {
    const audit = await models.data_change_audit.findOne({
      where: {
        modelName: "Referral Letter Officer History Note",
        action: AUDIT_ACTION.DATA_CREATED
      }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(officerHistoryNote.id);
    expect(audit.modelDescription).toEqual([
      { "Officer Name": caseOfficer.fullName }
    ]);
    expect(audit.user).toEqual("someone");
  });
});
