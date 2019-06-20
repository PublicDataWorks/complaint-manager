import ReferralLetter from "../../client/testUtilities/ReferralLetter";
import Case from "../../client/testUtilities/case";
import models from "../models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import {
  RECIPIENT,
  SENDER
} from "../handlers/cases/referralLetters/referralLetterDefaults";

describe("dataChangeAuditHooks for referral letter", () => {
  let existingCase, referralLetter;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id)
      .withRecipient(RECIPIENT)
      .withIncludeRetaliationConcerns(true)
      .withSender(SENDER);
    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      {
        auditUser: "someone"
      }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("creates audit on referral letter creation", async () => {
    const audit = await models.legacy_data_change_audit.findOne({
      where: { modelName: "Referral Letter", action: AUDIT_ACTION.DATA_CREATED }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelDescription).toEqual([]);
    expect(audit.modelId).toEqual(referralLetter.id);
    expect(audit.user).toEqual("someone");
    expect("recipient" in audit.changes).toBeTruthy();
    expect("sender" in audit.changes).toBeTruthy();
  });

  test("creates an audit for letter updates on model class", async () => {
    await models.referral_letter.update(
      { includeRetaliationConcerns: false },
      { where: { id: referralLetter.id }, auditUser: "someone" }
    );
    const audit = await models.legacy_data_change_audit.findOne({
      where: { modelName: "Referral Letter", action: AUDIT_ACTION.DATA_UPDATED }
    });

    expect(audit.changes).toEqual({
      includeRetaliationConcerns: { previous: true, new: false }
    });
  });

  test("creates an audit for letter updates on instance", async () => {
    await referralLetter.update(
      { includeRetaliationConcerns: false },
      { auditUser: "someone" }
    );

    const audit = await models.legacy_data_change_audit.findOne({
      where: { modelName: "Referral Letter", action: AUDIT_ACTION.DATA_UPDATED }
    });

    expect(audit.changes).toEqual({
      includeRetaliationConcerns: { previous: true, new: false }
    });
  });
});
