import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../models";
import {
  AUDIT_ACTION,
  AUDIT_FILE_TYPE,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import {
  transformNewFileAuditsToOldUploadDownloadActionAudits,
  transformOldUploadDownloadAccessAuditsToNewFileAudits
} from "./transformUploadDownloadActionAudits";

describe("transform upload and download action audits", () => {
  const testUser = "Gordon Ramsey";
  const testFileName = "IT'S_RAW_YOU_DONKEY.mp3";
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("transform old upload and download access audits to new", () => {
    test("should correctly create new file audits based on old update and download access audits", async () => {
      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
        auditDetails: {
          fileName: [testFileName]
        }
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        user: testUser,
        caseId: null,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        auditDetails: {
          fileName: [testFileName]
        }
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        user: testUser,
        caseId: null,
        subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
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
          fileName: [`${testFileName}lol`]
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

      await models.sequelize.transaction(async transaction => {
        await transformOldUploadDownloadAccessAuditsToNewFileAudits(
          transaction
        );
      });

      const newFileAuditRecords = await models.audit.findAll({
        include: [
          {
            model: models.file_audit,
            as: "fileAudit"
          }
        ]
      });

      expect(newFileAuditRecords.length).toEqual(5);
      expect(newFileAuditRecords).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DOWNLOADED,
            user: testUser,
            fileAudit: expect.objectContaining({
              fileType: AUDIT_FILE_TYPE.ATTACHMENT,
              fileName: `${testFileName}lol`
            })
          }),
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DOWNLOADED,
            user: testUser,
            fileAudit: expect.objectContaining({
              fileType: AUDIT_FILE_TYPE.ATTACHMENT,
              fileName: testFileName
            })
          }),
          expect.objectContaining({
            auditAction: AUDIT_ACTION.UPLOADED,
            user: testUser,
            fileAudit: expect.objectContaining({
              fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
              fileName: testFileName
            })
          }),
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DOWNLOADED,
            user: testUser,
            fileAudit: expect.objectContaining({
              fileType: AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF,
              fileName: testFileName
            })
          }),
          expect.objectContaining({
            auditAction: AUDIT_ACTION.DOWNLOADED,
            user: testUser,
            fileAudit: expect.objectContaining({
              fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF,
              fileName: testFileName
            })
          })
        ])
      );
    });
  });

  describe("transform new file audit to old upload download action audit", () => {
    // TODO Check to make sure that referral letter data and complainant letter data for the corresponding file audit will always exist just in case we have to ever migrate down we can easily migrate back up
    test("should create old upload download action audits from new file audits", async () => {
      await models.audit.create(
        {
          auditAction: AUDIT_ACTION.DOWNLOADED,
          user: testUser,
          fileAudit: {
            fileName: testFileName,
            fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF
          }
        },
        {
          include: [{ model: models.file_audit, as: "fileAudit" }]
        }
      );
      await models.audit.create(
        {
          auditAction: AUDIT_ACTION.UPLOADED,
          user: testUser,
          fileAudit: {
            fileName: testFileName,
            fileType: AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF
          }
        },
        {
          include: [{ model: models.file_audit, as: "fileAudit" }]
        }
      );
      await models.audit.create(
        {
          auditAction: AUDIT_ACTION.DOWNLOADED,
          user: testUser,
          fileAudit: {
            fileName: testFileName,
            fileType: AUDIT_FILE_TYPE.ATTACHMENT
          }
        },
        {
          include: [{ model: models.file_audit, as: "fileAudit" }]
        }
      );

      await models.sequelize.transaction(async transaction => {
        await transformNewFileAuditsToOldUploadDownloadActionAudits(
          transaction
        );
      });

      const Op = models.sequelize.Op;

      const uploadDownloadAudits = await models.action_audit.findAll({
        where: {
          [Op.or]: [
            { action: AUDIT_ACTION.DOWNLOADED },
            { action: AUDIT_ACTION.UPLOADED }
          ]
        }
      });

      const fileAudits = await models.file_audit.findAll();
      const newAudits = await models.audit.findAll();

      expect(uploadDownloadAudits.length).toEqual(3);
      expect(fileAudits.length).toEqual(0);
      expect(newAudits.length).toEqual(0);
      expect(uploadDownloadAudits).toEqual(
        expect.toIncludeSameMembers([
          expect.objectContaining({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
            auditDetails: {
              fileName: [testFileName]
            }
          }),
          expect.objectContaining({
            action: AUDIT_ACTION.UPLOADED,
            auditType: AUDIT_TYPE.UPLOAD,
            user: testUser,
            subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
            auditDetails: {
              fileName: [testFileName]
            }
          }),
          expect.objectContaining({
            action: AUDIT_ACTION.DOWNLOADED,
            auditType: AUDIT_TYPE.DATA_ACCESS,
            user: testUser,
            subject: AUDIT_SUBJECT.ATTACHMENT,
            auditDetails: {
              fileName: [testFileName]
            }
          })
        ])
      );
    });

    test("should not recreate upload and download action audits if the upload or download action audit already exists", async () => {
      const downloadFileAudit = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.DOWNLOADED,
          user: testUser,
          fileAudit: {
            fileName: testFileName,
            fileType: AUDIT_FILE_TYPE.FINAL_REFERRAL_LETTER_PDF
          }
        },
        {
          include: [{ model: models.file_audit, as: "fileAudit" }]
        }
      );

      const uploadFileAudit = await models.audit.create(
        {
          auditAction: AUDIT_ACTION.UPLOADED,
          user: testUser,
          fileAudit: {
            fileName: testFileName,
            fileType: AUDIT_FILE_TYPE.LETTER_TO_COMPLAINANT_PDF
          }
        },
        {
          include: [{ model: models.file_audit, as: "fileAudit" }]
        }
      );

      await models.action_audit.create({
        action: AUDIT_ACTION.DOWNLOADED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        createdAt: downloadFileAudit.createdAt,
        caseId: downloadFileAudit.caseId,
        user: testUser,
        subject: AUDIT_SUBJECT.FINAL_REFERRAL_LETTER_PDF,
        auditDetails: {
          fileName: [testFileName]
        }
      });

      await models.action_audit.create({
        action: AUDIT_ACTION.UPLOADED,
        auditType: AUDIT_TYPE.UPLOAD,
        createdAt: uploadFileAudit.createdAt,
        user: testUser,
        caseId: uploadFileAudit.caseId,
        subject: AUDIT_SUBJECT.LETTER_TO_COMPLAINANT_PDF,
        auditDetails: {
          fileName: [testFileName]
        }
      });

      await models.sequelize.transaction(async transaction => {
        await transformNewFileAuditsToOldUploadDownloadActionAudits(
          transaction
        );
      });

      const uploadDownloadActionAudits = await models.action_audit.findAll({});

      expect(uploadDownloadActionAudits.length).toEqual(2);
    });
  });
});
