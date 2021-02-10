import ReferralLetter from "../testHelpers/ReferralLetter";
import Case from "../../sharedTestHelpers/case";
import models from "../policeDataManager/models";
import { AUDIT_ACTION } from "../../sharedUtilities/constants";
import { cleanupDatabase } from "../testHelpers/requestTestHelpers";
import constants from "../../instance-files/referralLetterDefaults";

describe("dataChangeAuditHooks for referral letter", () => {
  const { RECIPIENT, RECIPIENT_ADDRESS, SENDER } = constants || {};
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
      .withRecipientAddress(RECIPIENT_ADDRESS)
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
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_CREATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "referral_letter"
          }
        }
      ]
    });

    expect(audit.referenceId).toEqual(existingCase.id);
    expect(audit.dataChangeAudit.modelDescription).toEqual([]);
    expect(audit.dataChangeAudit.modelId).toEqual(referralLetter.id);
    expect(audit.user).toEqual("someone");
    expect("recipient" in audit.dataChangeAudit.changes).toBeTruthy();
    expect("sender" in audit.dataChangeAudit.changes).toBeTruthy();
    expect(audit.managerType).toEqual("complaint");
  });

  test("creates an audit for letter updates on model class", async () => {
    await models.referral_letter.update(
      { includeRetaliationConcerns: false },
      { where: { id: referralLetter.id }, auditUser: "someone" }
    );
    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "referral_letter"
          }
        }
      ]
    });

    expect(audit.dataChangeAudit.changes).toEqual({
      includeRetaliationConcerns: { previous: true, new: false }
    });
  });

  test("creates an audit for letter updates on instance", async () => {
    await referralLetter.update(
      { includeRetaliationConcerns: false },
      { auditUser: "someone" }
    );

    const audit = await models.audit.findOne({
      where: { auditAction: AUDIT_ACTION.DATA_UPDATED },
      include: [
        {
          as: "dataChangeAudit",
          model: models.data_change_audit,
          where: {
            modelName: "referral_letter"
          }
        }
      ]
    });

    expect(audit.dataChangeAudit.changes).toEqual({
      includeRetaliationConcerns: { previous: true, new: false }
    });
  });
});
