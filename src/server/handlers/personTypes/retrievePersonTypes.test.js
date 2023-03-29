import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import { USER_PERMISSIONS } from "../../../sharedUtilities/constants";
import PersonType from "../../../sharedTestHelpers/PersonType";

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

describe("retrievePersonTypes", () => {
  let personType;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    personType = await models.personType.create(
      new PersonType.Builder().defaultPersonType(),
      { auditUser: "user" }
    );
  });

  test("returns signers when authorized", async () => {
    const token = buildTokenWithPermissions(
      USER_PERMISSIONS.CREATE_CASE,
      "nickname"
    );
    const responsePromise = request(app)
      .get("/api/person-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, [
      expect.objectContaining({
        abbreviation: personType.abbreviation,
        description: personType.description,
        dialogAction: personType.dialogAction,
        employeeDescription: personType.employeeDescription,
        isDefault: personType.isDefault,
        isEmployee: personType.isEmployee,
        key: personType.key,
        legend: personType.legend
      })
    ]);
  });
});
