import models from "../index";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../sharedTestHelpers/Officer";
import Case from "../../../../sharedTestHelpers/case";
import LetterOfficer from "../../../testHelpers/LetterOfficer";
import ReferralLetterOfficerHistoryNote from "../../../testHelpers/ReferralLetterOfficerHistoryNote";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import ReferralLetterOfficerRecommendedAction from "../../../testHelpers/ReferralLetterOfficerRecommendedAction";

describe("letterOfficer model", function () {
  let letterOfficer;
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
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

    const letterOfficerAttributes = new LetterOfficer.Builder()
      .defaultLetterOfficer()
      .withId(undefined)
      .withCaseOfficerId(caseOfficer.id);

    letterOfficer = await models.letter_officer.create(
      letterOfficerAttributes,
      { auditUser: "test" }
    );
  });

  test("it deletes referral letter officer history notes when letter officer deleted", async () => {
    const noteAttributes = new ReferralLetterOfficerHistoryNote.Builder()
      .defaultReferralLetterOfficerHistoryNote()
      .withReferralLetterOfficerId(letterOfficer.id)
      .withId(undefined);

    const note = await models.referral_letter_officer_history_note.create(
      noteAttributes,
      { auditUser: "someone" }
    );

    await models.sequelize.transaction(
      async transaction =>
        await letterOfficer.destroy({
          auditUser: "someone",
          transaction
        })
    );

    await note.reload({ paranoid: false });
    expect(note.deletedAt).not.toEqual(null);
  });

  test("it deletes referral letter officer recommended actions when letter officer deleted", async () => {
    const recommendedAction = await models.recommended_action.create(
      { description: "some description" },
      { auditUser: "someone" }
    );

    const referralLetterOfficerRecommendedActionAttributes =
      new ReferralLetterOfficerRecommendedAction.Builder()
        .defaultReferralLetterOfficerRecommendedAction()
        .withId(undefined)
        .withRecommendedActionId(recommendedAction.id)
        .withReferralLetterOfficerId(letterOfficer.id);

    const referralLetterOfficerRecommendedAction =
      await models.referral_letter_officer_recommended_action.create(
        referralLetterOfficerRecommendedActionAttributes,
        { auditUser: "someone" }
      );

    await models.sequelize.transaction(
      async transaction =>
        await letterOfficer.destroy({
          auditUser: "someone",
          transaction
        })
    );

    await referralLetterOfficerRecommendedAction.reload({ paranoid: false });
    expect(referralLetterOfficerRecommendedAction.deletedAt).not.toEqual(null);
  });

  test("should not be able to set recommendedActionNotes to null", () => {
    const { recommendedActionNotes } = letterOfficer.toJSON();
    letterOfficer.recommendedActionNotes = null;
    expect(letterOfficer.recommendedActionNotes).toEqual(
      recommendedActionNotes
    );
  });
});
