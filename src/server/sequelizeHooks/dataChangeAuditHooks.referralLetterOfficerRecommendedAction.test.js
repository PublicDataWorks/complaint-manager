import Case from "../../sharedTestHelpers/case";
import models from "../policeDataManager/models";
import Officer from "../../sharedTestHelpers/Officer";
import CaseOfficer from "../../sharedTestHelpers/caseOfficer";
import LetterOfficer from "../testHelpers/LetterOfficer";
import ReferralLetterOfficerRecommendedAction from "../testHelpers/ReferralLetterOfficerRecommendedAction";
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

    const officerRecommendedActionAttributes =
      new ReferralLetterOfficerRecommendedAction.Builder()
        .defaultReferralLetterOfficerRecommendedAction()
        .withId(undefined)
        .withReferralLetterOfficerId(letterOfficer.id)
        .withRecommendedActionId(recommendedAction.id);
    officerRecommendedAction =
      await models.referral_letter_officer_recommended_action.create(
        officerRecommendedActionAttributes,
        { auditUser: "someone" }
      );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it creates an audit for creating an officer recommended action", async () => {
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "referral_letter_officer_recommended_action"
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(officerRecommendedAction.id);
    expect(audit.dataChangeAudit.modelDescription).toEqual([
      { "Officer Name": caseOfficer.fullName }
    ]);
    expect(audit.dataChangeAudit.changes.recommendedAction).toEqual({
      new: recommendedAction.description
    });
    expect(audit.dataChangeAudit.snapshot.recommendedAction).toEqual(
      recommendedAction.description
    );
    expect(audit.dataChangeAudit.snapshot.recommendedActionId).toEqual(
      recommendedAction.id
    );
    expect(audit.user).toEqual("someone");
    expect(audit.managerType).toEqual("complaint");
  });
});
