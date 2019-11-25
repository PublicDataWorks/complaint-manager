import Case from "../../client/complaintManager/testUtilities/case";
import models from "../complaintManager/models";
import ReferralLetter from "../../client/complaintManager/testUtilities/ReferralLetter";
import {
  RECIPIENT,
  SENDER
} from "../handlers/cases/referralLetters/referralLetterDefaults";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import ReferralLetterIAProCorrection from "../../client/complaintManager/testUtilities/ReferralLetterIAProCorrection";
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
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "referral_letter_iapro_correction"
          }
        }
      ]
    });

    expect(audit.caseId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelId).toEqual(
      referralLetterIaproCorrection.id
    );
    expect(audit.dataChangeAudit.modelDescription).toEqual([]);
    expect(audit.user).toEqual("someone");
  });
});
