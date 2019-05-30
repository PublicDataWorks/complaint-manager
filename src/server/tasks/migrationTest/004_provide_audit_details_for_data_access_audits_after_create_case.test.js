import migration from "../migrations/004_provide_audit_details_for_data_access_audits_after_create_case";
import {
  provideAuditDetailsForDataAccessAuditsAfterCreateCase,
  setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessAuditsAfterCreateCase";

jest.mock(
  "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessAuditsAfterCreateCase"
);

describe("test provide_audit_details_for_data_access_audits_after_create_case migration", () => {
  test("up", async () => {
    await migration.up();

    expect(
      provideAuditDetailsForDataAccessAuditsAfterCreateCase
    ).toHaveBeenCalled();
  });

  test("down", async () => {
    await migration.down();

    expect(
      setAuditDetailsToEmptyForDataAccessAuditsAfterCreateCase
    ).toHaveBeenCalled();
  });
});
