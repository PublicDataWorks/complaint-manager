import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
const models = require("../../../policeDataManager/models");
const isDuplicateFileName = require("./isDuplicateFileName");
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";

describe("generateFileName", () => {
  let newCase;
  jest.setTimeout(60000);
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const someCase = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantCivilians([])
      .withAttachments([])
      .withIncidentLocation(undefined)
      .build();

    newCase = await models.cases.create(someCase, { auditUser: "someone" });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should return true when file with requested name has been added to case", async () => {
    const requestedFileName = "dog_nose.jpeg";
    await models.attachment.create(
      {
        caseId: newCase.id,
        description: "test description",
        fileName: requestedFileName
      },
      {
        auditUser: "someone"
      }
    );

    const result = await isDuplicateFileName(newCase.id, requestedFileName);

    expect(result).toEqual(true);
  });

  test("should return false when file name does not exactly match an existing attachment for this case", async () => {
    const requestedFileName = "dog_nose.jpeg";

    await models.attachment.create(
      {
        caseId: newCase.id,
        description: "test description",
        fileName: `1-${requestedFileName}`
      },
      {
        auditUser: "someone"
      }
    );

    const result = await isDuplicateFileName(newCase.id, requestedFileName);

    expect(result).toEqual(false);
  });

  test("should return false when file with requested name has not been added to case", async () => {
    const requestedFileName = "dog_nose.jpeg";

    const result = await isDuplicateFileName(newCase.id, requestedFileName);

    expect(result).toEqual(false);
  });
});
