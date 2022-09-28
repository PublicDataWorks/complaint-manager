import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import { seedStandardCaseStatuses } from "../../testHelpers/testSeeding";

jest.mock(
  "../../getFeaturesAsync",
  () => callback =>
    callback([
      {
        id: "FEATURE",
        name: "FEATURE",
        description: "This is a feature",
        enabled: true
      }
    ])
);

describe("getCaseStatuses", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await seedStandardCaseStatuses();
  });

  test("should retrieve case statuses", async () => {
    const token = buildTokenWithPermissions("", "nickname");
    const responsePromise = request(app)
      .get("/api/case-statuses")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, [
      { id: 1, name: "Initial", orderKey: 0 },
      { id: 2, name: "Active", orderKey: 1 },
      { id: 3, name: "Letter in Progress", orderKey: 2 },
      { id: 4, name: "Ready for Review", orderKey: 3 },
      { id: 5, name: "Forwarded to Agency", orderKey: 4 },
      { id: 6, name: "Closed", orderKey: 5 }
    ]);
  });
});
