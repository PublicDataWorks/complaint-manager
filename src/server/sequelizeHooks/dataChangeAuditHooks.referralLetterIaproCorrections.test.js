import Case from "../../client/testUtilities/case";
import models from "../models";
import ReferralLetter from "../../client/testUtilities/ReferralLetter";
import {
  RECIPIENT,
  SENDER
} from "../handlers/cases/referralLetters/referralLetterDefaults";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import ReferralLetterIAProCorrection from "../../client/testUtilities/ReferralLetterIAProCorrection";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";

describe("dataChangeAuditHooks for referral letter iapro correction", () => {
  let existingCase, referralLetter, referralLetterIaproCorrection;

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

    const referralLetterIaproCorrectionAttributes = new ReferralLetterIAProCorrection.Builder()
      .defaultReferralLetterIAProCorrection()
      .withId(undefined)
      .withReferralLetterId(referralLetter.id);
    referralLetterIaproCorrection = await models.referral_letter_iapro_correction.create(
      referralLetterIaproCorrectionAttributes,
      {
        auditUser: "someone"
      }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("creates audit on referral letter iapro corrections creation", async () => {
    const audit = await models.legacy_data_change_audit.findOne({
      where: {
        modelName: "Referral Letter Iapro Correction",
        action: AUDIT_ACTION.DATA_CREATED
      }
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.modelId).toEqual(referralLetterIaproCorrection.id);
    expect(audit.modelDescription).toEqual([]);
    expect(audit.user).toEqual("someone");
  });
});
