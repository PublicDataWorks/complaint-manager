import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";

describe("getCaseStatuses", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(2)
        .withName("Active")
        .withOrderKey(1)
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(3)
        .withName("Letter in Progress")
        .withOrderKey(2)
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(4)
        .withName("Ready for Review")
        .withOrderKey(3)
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(5)
        .withName("Forwarded to Agency")
        .withOrderKey(4)
        .build(),
      {
        auditUser: "user"
      }
    );

    await models.caseStatus.create(
      new CaseStatus.Builder()
        .withId(6)
        .withName("Closed")
        .withOrderKey(5)
        .build(),
      {
        auditUser: "user"
      }
    );
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