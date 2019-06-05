import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import ReferralLetter from "../../../../client/testUtilities/ReferralLetter";
import models from "../../../models";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import {
  rollbackSanitizeSingleUploadDownloadAudit,
  rollbackSanitizeUploadDownloadAudits,
  sanitizeSingleUploadDownloadAudit,
  sanitizeUploadDownloadAudits
} from "./provideAuditDetailsForUploadAndDownloadAudits";
import ComplainantLetter from "../../../../client/testUtilities/complainantLetter";

describe("provideAuditDetailsForUploadDownloadAudits", () => {
  const testFileName = "r2d2_scream.mp3";
  const testUser = "R2D2";
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("sanitizeUploadDownloadAudits", () => {
    let existingCase;
    beforeEach(async () => {
      existingCase = await createTestCaseWithCivilian();
    });

    describe("sanitizeSingleUploadDownloadAudit", () => {
      describe("downloads", () => {
        test("should update audit details for FinalReferralLetterPdf Download", async () => {
          await models.referral_letter.create(
            new ReferralLetter.Builder()
              .defaultReferralLetter()
              .withId(undefined)
              .withCaseId(existingCase.id)
              .withFinalPdfFilename(testFileName),
            { auditUser: testUser }
          );

          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            auditDetails: {}
          });

          await models.sequelize.transaction(async transaction => {
            await sanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: {
                fileName: [testFileName]
              }
            })
          );
        });

        test("should update audit details for LetterToComplainantPDF Download", async () => {
          await models.complainant_letter.create(
            new ComplainantLetter.Builder()
              .defaultComplainantLetter()
              .withId(undefined)
              .withComplainantCivilianId(undefined)
              .withCaseId(existingCase.id)
              .withFinalPdfFilename(testFileName),
            { auditUser: testUser }
          );

          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
            auditDetails: {}
          });

          await models.sequelize.transaction(async transaction => {
            await sanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: {
                fileName: [testFileName]
              }
            })
          );
        });
      });

      describe("uploads", () => {
        test("should update audit details for LetterToComplainantPdf Upload", async () => {
          await models.complainant_letter.create(
            new ComplainantLetter.Builder()
              .defaultComplainantLetter()
              .withId(undefined)
              .withComplainantCivilianId(undefined)
              .withCaseId(existingCase.id)
              .withFinalPdfFilename(testFileName),
            { auditUser: testUser }
          );

          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.UPLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
            auditDetails: {}
          });

          await models.sequelize.transaction(async transaction => {
            await sanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: {
                fileName: [testFileName]
              }
            })
          );
        });

        test("should update audit details for FinalReferralLetterPdf Upload", async () => {
          await models.referral_letter.create(
            new ReferralLetter.Builder()
              .defaultReferralLetter()
              .withId(undefined)
              .withCaseId(existingCase.id)
              .withFinalPdfFilename(testFileName),
            { auditUser: testUser }
          );

          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.UPLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            auditDetails: {}
          });

          await models.sequelize.transaction(async transaction => {
            await sanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: {
                fileName: [testFileName]
              }
            })
          );
        });

        test("should update audit details for ReferralLetterPdf Upload", async () => {
          await models.referral_letter.create(
            new ReferralLetter.Builder()
              .defaultReferralLetter()
              .withId(undefined)
              .withCaseId(existingCase.id)
              .withFinalPdfFilename(testFileName),
            { auditUser: testUser }
          );

          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.UPLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: "Referral Letter PDF",
            auditDetails: {}
          });

          await models.sequelize.transaction(async transaction => {
            await sanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
              auditDetails: {
                fileName: [testFileName]
              }
            })
          );
        });
      });

      describe("attachments", () => {
        test("should update audit subject and format audit details correctly when audit subject is 'Attachments'", async () => {
          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: "Attachments",
            auditDetails: {
              fileName: testFileName
            }
          });

          await models.sequelize.transaction(async transaction => {
            await sanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              subject: AUDIT_SUBJECT.ATTACHMENT,
              auditDetails: {
                fileName: [testFileName]
              }
            })
          );
        });

        test("should retain correct audit details and audit subject when audit subject is AUDIT_SUBJECT.ATTACHMENT", async () => {
          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: existingCase.id,
            subject: AUDIT_SUBJECT.ATTACHMENT,
            auditDetails: {
              fileName: [testFileName]
            }
          });

          await models.sequelize.transaction(async transaction => {
            await sanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              subject: AUDIT_SUBJECT.ATTACHMENT,
              auditDetails: {
                fileName: [testFileName]
              }
            })
          );
        });
      });
    });

    test("should update existing audits", async () => {
      await models.referral_letter.create(
        new ReferralLetter.Builder()
          .defaultReferralLetter()
          .withId(undefined)
          .withCaseId(existingCase.id)
          .withFinalPdfFilename(testFileName),
        { auditUser: testUser }
      );

      await models.complainant_letter.create(
        new ComplainantLetter.Builder()
          .defaultComplainantLetter()
          .withId(undefined)
          .withComplainantCivilianId(undefined)
          .withCaseId(existingCase.id)
          .withFinalPdfFilename(testFileName),
        { auditUser: testUser }
      );

      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
        auditDetails: {}
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        auditDetails: {}
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: "Referral Letter PDF",
        auditDetails: {}
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: "Attachments",
        auditDetails: {
          fileName: `${testFileName}lol`
        }
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: existingCase.id,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        auditDetails: {
          fileName: [testFileName]
        }
      });

      await sanitizeUploadDownloadAudits();

      const audits = await models.action_audit.findAll();

      expect(audits).toIncludeSameMembers([
        expect.objectContaining({
          action: AUDIT_ACTION.DOWNLOADED,
          subject: AUDIT_SUBJECT.ATTACHMENT,
          auditDetails: {
            fileName: [`${testFileName}lol`]
          }
        }),
        expect.objectContaining({
          action: AUDIT_ACTION.DOWNLOADED,
          subject: AUDIT_SUBJECT.ATTACHMENT,
          auditDetails: {
            fileName: [testFileName]
          }
        }),
        expect.objectContaining({
          action: AUDIT_ACTION.UPLOADED,
          subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
          auditDetails: {
            fileName: [testFileName]
          }
        }),
        expect.objectContaining({
          action: AUDIT_ACTION.DOWNLOADED,
          subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
          auditDetails: {
            fileName: [testFileName]
          }
        }),
        expect.objectContaining({
          action: AUDIT_ACTION.DOWNLOADED,
          subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
          auditDetails: {
            fileName: [testFileName]
          }
        })
      ]);
    });
  });

  describe("rollbackSanitizeUploadDownloadAudits", () => {
    describe("rollbackSanitizeSingleUploadDownloadAudit", () => {
      describe("download", () => {
        test("should revert audit details for Letter To Complainant PDF Download", async () => {
          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
            auditDetails: {
              fileName: [testFileName]
            }
          });

          await models.sequelize.transaction(async transaction => {
            await rollbackSanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: {},
              subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF
            })
          );
        });
        test("should revert audit details of Final Referral Letter PDF and audit subject to ReferralLetterPDF", async () => {
          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            auditDetails: {
              fileName: [testFileName]
            }
          });

          await models.sequelize.transaction(async transaction => {
            await rollbackSanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: {},
              subject: "Referral Letter PDF"
            })
          );
        });
      });
      describe("uploaded", () => {
        test("should revert audit details for Letter To Complainant PDF Upload", async () => {
          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.UPLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
            auditDetails: {
              fileName: [testFileName]
            }
          });

          await models.sequelize.transaction(async transaction => {
            await rollbackSanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: null,
              subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF
            })
          );
        });
        test("should revert audit details for Final Referral Letter PDF Upload", async () => {
          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.UPLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            auditDetails: {
              fileName: [testFileName]
            }
          });

          await models.sequelize.transaction(async transaction => {
            await rollbackSanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          await existingActionAudit.reload();

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              auditDetails: null,
              subject: "Referral Letter PDF"
            })
          );
        });
      });
      describe("attachments", () => {
        test("should revert audit details and audit subject for an Attachment audit", async () => {
          const existingActionAudit = await models.action_audit.create({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            caseId: null,
            subject: AUDIT_SUBJECT.ATTACHMENT,
            auditDetails: {
              fileName: [testFileName]
            }
          });

          await models.sequelize.transaction(async transaction => {
            await rollbackSanitizeSingleUploadDownloadAudit(
              existingActionAudit,
              transaction
            );
          });

          expect(existingActionAudit).toEqual(
            expect.objectContaining({
              subject: "Attachments",
              auditDetails: {
                fileName: testFileName
              }
            })
          );
        });
      });
    });

    test("should rollback existing download and upload action audits", async () => {
      await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        auditDetails: {
          fileName: [testFileName]
        }
      });
      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: AUDIT_SUBJECT.ATTACHMENT,
        auditDetails: {
          fileName: [testFileName]
        }
      });

      await rollbackSanitizeUploadDownloadAudits();

      const audits = await models.action_audit.findAll();

      expect(audits).toIncludeSameMembers([
        expect.objectContaining({
          action: AUDIT_ACTION.UPLOADED,
          subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
          auditDetails: null
        }),
        expect.objectContaining({
          action: AUDIT_ACTION.DOWNLOADED,
          subject: "Attachments",
          auditDetails: {
            fileName: testFileName
          }
        })
      ]);
    });
  });
});
