import Case from "../../client/testUtilities/case";
import models from "../models";
import Officer from "../../client/testUtilities/Officer";
import CaseOfficer from "../../client/testUtilities/caseOfficer";
import LetterOfficer from "../../client/testUtilities/LetterOfficer";
import ReferralLetterOfficerRecommendedAction from "../../client/testUtilities/ReferralLetterOfficerRecommendedAction";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";

describe("dataChangeAuditHooks for referral letter officer recommended action", () => {
  let existingCase, officerRecommendedAction, caseOfficer, recommendedAction;

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

    recommendedAction = await models.recommended_action.create(
      {
        description: "Recommended Action Description"
      },
      { auditUser: "someone" }
    );

    const officerRecommendedActionAttributes = new ReferralLetterOfficerRecommendedAction.Builder()
      .defaultReferralLetterOfficerRecommendedAction()
      .withId(undefined)
      .withReferralLetterOfficerId(letterOfficer.id)
      .withRecommendedActionId(recommendedAction.id);
    officerRecommendedAction = await models.referral_letter_officer_recommended_action.create(
      officerRecommendedActionAttributes,
      { auditUser: "someone" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("it creates an audit for creating an officer recommended action", async () => {
    const audit = await models.data_change_audit.find({
      where: {
        modelName: "Referral Letter Officer Recommended Action",
        action: AUDIT_ACTION.DATA_CREATED
      }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(officerRecommendedAction.id);
    expect(audit.modelDescription).toEqual([
      { "Officer Name": caseOfficer.fullName }
    ]);
    expect(audit.changes.recommendedAction).toEqual({
      new: recommendedAction.description
    });
    expect(audit.user).toEqual("someone");
  });
});
