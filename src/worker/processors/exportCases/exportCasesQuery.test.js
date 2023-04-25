import exportCasesQuery from "./exportCasesQuery";

describe("exportCasesQuery", () => {
  test("does not include deleted items", () => {
    //do not delete this test. it's easy to forget to add the where clause to excluded soft deleted items from the export
    const queryString = exportCasesQuery();
    const fromCount = queryString.match(/from/gi).length;
    const joinCount = queryString.match(/join/gi).length;
    const deletedAtCount = queryString.match(/deleted_at/g).length;
    const expectedExtraJoinFromCount = 18;
    // Expected from/join occurrences that don't have matching deleted_at occurrences:
    // (1) attachments are hard deleted as of now, so they don't have deleted_at column
    // (1) allegations are not deleted so they don't have deleted_at column
    // (4) substring function uses the word from
    // (2) there are two joins on sub queries that already check for deleted in the sub queries
    // (1) classification does not have deleted_at column
    // (1) race_ethnicity does not have deleted_at column
    // (1) intake_sources does not have a deleted at column
    // (1) gender_identity does not have a deleted at column
    // (1) how_did_you_hear_about_us_sources does not have a deleted at column
    // (1) districts does not have a deleted at column
    // (1) cast_statuses does not have a deleted at column
    // (3) person_types does not have a deleted_at column
    const fromJoinDeletedAtBalance =
      fromCount + joinCount - deletedAtCount - expectedExtraJoinFromCount;
    expect(fromJoinDeletedAtBalance).toEqual(0);
  });
});
