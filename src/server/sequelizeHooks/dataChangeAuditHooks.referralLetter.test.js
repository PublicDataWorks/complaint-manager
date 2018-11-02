import ReferralLetter from "../../client/testUtilities/ReferralLetter";
import Case from "../../client/testUtilities/case";
import models from "../models";
import { AUDIT_ACTION, CASE_STATUS } from "../../sharedUtilities/constants";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import {
  RECIPIENT,
  SENDER
} from "../handlers/cases/referralLetters/letterDefaults";

describe("dataChangeAuditHooks for referral ldatetter", () => {
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
    const audit = await models.data_change_audit.find({
      where: { modelName: "Referral Letter", action: AUDIT_ACTION.DATA_CREATED }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelDescription).toEqual([]);
    expect(audit.modelId).toEqual(referralLetter.id);
    expect(audit.user).toEqual("someone");
    expect("recipient" in audit.changes).toBeTruthy();
    expect("sender" in audit.changes).toBeTruthy();
  });
});
