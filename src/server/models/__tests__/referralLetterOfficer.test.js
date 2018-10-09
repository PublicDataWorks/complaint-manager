import models from "../index";
import CaseOfficer from "../../../client/testUtilities/caseOfficer";
import Officer from "../../../client/testUtilities/Officer";
import Case from "../../../client/testUtilities/case";
import ReferralLetterOfficer from "../../../client/testUtilities/ReferralLetterOfficer";
import ReferralLetterOfficerHistoryNote from "../../../client/testUtilities/ReferralLetterOfficerHistoryNote";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";

describe("referralLetterOfficer model", function() {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it deletes referral letter officer history notes when letter officer deleted", async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    const existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "test"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withCaseId(existingCase.id);

    const caseOfficer = await models.case_officer.create(
      caseOfficerAttributes,
      {
        auditUser: "test"
      }
    );

    const referralLetterOfficerAttributes = new ReferralLetterOfficer.Builder()
      .defaultReferralLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(caseOfficer.id);

    const referralLetterOfficer = await models.referral_letter_officer.create(
      referralLetterOfficerAttributes,
      { auditUser: "test" }
    );

    const noteAttributes = new ReferralLetterOfficerHistoryNote.Builder()
      .defaultReferralLetterOfficerHistoryNote()
      .withReferralLetterOfficerId(referralLetterOfficer.id)
      .withId(undefined);

    const note = await models.referral_letter_officer_history_note.create(
      noteAttributes,
      { auditUser: "someone" }
    );

    await models.sequelize.transaction(
      async transaction =>
        await referralLetterOfficer.destroy({
          auditUser: "someone",
          transaction
        })
    );

    await note.reload({ paranoid: false });
    expect(note.deletedAt).not.toEqual(null);
  });
});
