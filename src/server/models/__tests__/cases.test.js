import models from "../index";
import Case from "../../../client/testUtilities/case";

describe("cases", function() {
  let createdCase;

  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();
    createdCase = await models.cases.create(caseToCreate, {
      auditUser: "Someone"
    });
  });

  afterEach(async () => {
    await models.cases.truncate({ cascade: true, force: true });
    await models.data_change_audit.truncate({ force: true });
  });

  test("should not change status when updating nothing", async () => {
    await createdCase.update({}, { auditUser: "Someone" });

    await createdCase.reload();
    expect(createdCase.dataValues.status).toEqual("Initial");
  });

  test("should change status from initial to active when updating something", async () => {
    await createdCase.update(
      { assignedTo: "someone else" },
      { auditUser: "Someone" }
    );

    await createdCase.reload();
    expect(createdCase.dataValues.status).toEqual("Active");
  });
});
