import models from "../index";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import LetterOfficer from "../../../testHelpers/LetterOfficer";
import Officer from "../../../../sharedTestHelpers/Officer";
import ReferralLetterOfficerHistoryNote from "../../../testHelpers/ReferralLetterOfficerHistoryNote";

describe("Referral Letter Officer History Note", () => {
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should not allow pibCaseNumber to be set to null", async () => {
    const c4se = await models.cases.create(
      new Case.Builder().defaultCase().build(),
      { auditUser: "user" }
    );

    const officer = await models.officer.create(
      new Officer.Builder().defaultOfficer().build(),
      { auditUser: "user" }
    );

    const caseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withOfficerId(officer.id)
        .withCaseId(c4se.id)
        .build(),
      { auditUser: "user" }
    );

    const letterOfficer = await models.letter_officer.create(
      new LetterOfficer.Builder()
        .defaultLetterOfficer()
        .withCaseOfficerId(caseOfficer.id),
      { auditUser: "user" }
    );

    const pibCaseNumber = "5467890";
    const historyNote =
      await models.referral_letter_officer_history_note.create(
        new ReferralLetterOfficerHistoryNote.Builder()
          .defaultReferralLetterOfficerHistoryNote()
          .withPibCaseNumber(pibCaseNumber)
          .withReferralLetterOfficerId(letterOfficer.id),
        { auditUser: "user" }
      );
    historyNote.pibCaseNumber = null;
    expect(historyNote.pibCaseNumber).toEqual(pibCaseNumber);
  });
});
