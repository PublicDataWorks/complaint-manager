import migration from "../migrations/005_provide_audit_details_for_data_access_audits_when_auditing_case_with_all_associations";
import {
  provideAuditDetailsForDataAccessOfCaseWithAllAssociations,
  setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations
} from "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessOfCaseWithAllAssociations";

jest.mock(
  "../taskMigrationJobs/auditTransformationJobs/provideAuditDetailsForDataAccessOfCaseWithAllAssociations"
);

describe("test provide_case_details_for_data_access_audits_after_create_case migration", () => {
  test("up", async () => {
    await migration.up();

    expect(
      provideAuditDetailsForDataAccessOfCaseWithAllAssociations
    ).toHaveBeenCalled();
  });

  test("down", async () => {
    await migration.down();

    expect(
      setAuditDetailsToEmptyForDataAccessOfCaseWithAllAssociations
    ).toHaveBeenCalled();
  });
});
