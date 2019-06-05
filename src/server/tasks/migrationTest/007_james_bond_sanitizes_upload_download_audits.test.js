import migration from "../migrations/007_james_bond_sanitizes_upload_download_audits";
import {
  rollbackSanitizeUploadDownloadAudits,
  sanitizeUploadDownloadAudits
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForUploadAndDownloadAudits";

jest.mock(
  "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForUploadAndDownloadAudits"
);

describe("test 007_james_bond_sanitizes_upload_download_audits", () => {
  describe("up", () => {
    test("should call sanitize upload download audits", () => {
      migration.up();

      expect(sanitizeUploadDownloadAudits).toHaveBeenCalled();
    });
  });

  describe("down", () => {
    test("should call rollback sanitize upload download audits", () => {
      migration.down();

      expect(rollbackSanitizeUploadDownloadAudits).toHaveBeenCalled();
    });
  });
});
