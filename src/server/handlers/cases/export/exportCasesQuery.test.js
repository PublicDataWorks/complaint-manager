import exportCasesQuery from "./exportCasesQuery";

describe("exportCasesQuery", () => {
  test("does not include deleted items", () => {
    //do not delete this test. it's easy to forget to add the where clause to excluded soft deleted items from the export
    const queryString = exportCasesQuery();
    const fromCount = queryString.match(/from/gi).length;
    const joinCount = queryString.match(/join/gi).length;
    const deletedAtCount = queryString.match(/deleted_at/g).length;
    const expectedExtraJoinFromCount = 10;
    // Expected from/join occurrences that don't have matching deleted_at occurrences:
    // (1) cases are never deleted so they don't have deleted_at column
    // (1) attachments are hard deleted as of now, so they don't have deleted_at column
    // (1) allegations are not deleted so they don't have deleted_at column
    // (1) classifications are not deleted so they don't have deleted_at column
    // (4) substring function uses the word from
    // (2) there are two joins on sub queries that already check for deleted in the sub queries
    const fromJoinDeletedAtBalance =
      fromCount + joinCount - deletedAtCount - expectedExtraJoinFromCount;
    expect(fromJoinDeletedAtBalance).toEqual(0);
  });
});
