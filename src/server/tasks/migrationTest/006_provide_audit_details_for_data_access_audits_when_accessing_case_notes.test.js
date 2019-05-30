import migration from "../migrations/006_provide_audit_details_for_data_access_audits_when_accessing_case_notes";
import {
  provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes,
  setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes";

jest.mock(
  "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes"
);

describe("test 006_provide_audit_details_for_data_access_audits_when_accessing_case_notes migration", () => {
  describe("up", () => {
    test("should call provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes", () => {
      migration.up();

      expect(
        provideAuditDetailsForDataAccessAuditsWhenAccessingCaseNotes
      ).toHaveBeenCalled();
    });
  });

  describe("down", () => {
    test("should call provide audit details for data access audit when accessing case notes", () => {
      migration.down();

      expect(
        setAuditDetailsToEmptyForDataAccessAuditsWhenAccessingCaseNotes
      ).toHaveBeenCalled();
    });
  });
});
