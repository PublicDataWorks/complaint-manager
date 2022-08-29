import models from "../../../policeDataManager/models";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import determineNextCaseStatus from "./determineNextCaseStatus";

const extractRelevantAttributes = statusModel => {
  const { id, name, orderKey } = statusModel.toJSON();
  return { id, name, order_key: orderKey };
};

describe("determineNextCaseStatus", () => {
  let status0, status1, status2, status3, status4;
  beforeAll(async () => {
    status0 = await models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .withId(9997)
        .withOrderKey(0)
        .withName("Frida")
        .build(),
      { auditUser: "user" }
    );

    status1 = await models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .withId(9)
        .withOrderKey(1)
        .withName("Scooby")
        .build(),
      { auditUser: "user" }
    );

    status2 = await models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .withId(4)
        .withOrderKey(2)
        .withName("Goofy")
        .build(),
      { auditUser: "user" }
    );

    status3 = await models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .withId(2)
        .withOrderKey(3)
        .withName("Pluto")
        .build(),
      { auditUser: "user" }
    );

    status4 = await models.caseStatus.create(
      new CaseStatus.Builder()
        .defaultCaseStatus()
        .withId(99787)
        .withOrderKey(4)
        .withName("Oslo")
        .build(),
      { auditUser: "user" }
    );
  });

  afterAll(async () => {
    await cleanupDatabase();
    await models.sequelize.close();
  });

  test("should return status0 when undefined", async () => {
    const result = await determineNextCaseStatus(undefined);
    expect(result).toEqual(extractRelevantAttributes(status0));
  });

  test("should return the status1 when passed status0", async () => {
    const result = await determineNextCaseStatus(status0.name);
    expect(result).toEqual(extractRelevantAttributes(status1));
  });

  test("should return the status2 when passed status1", async () => {
    const result = await determineNextCaseStatus(status1.name);
    expect(result).toEqual(extractRelevantAttributes(status2));
  });

  test("should return the status3 when passed status2", async () => {
    const result = await determineNextCaseStatus(status2.name);
    expect(result).toEqual(extractRelevantAttributes(status3));
  });

  test("should return the status4 when passed status3", async () => {
    const result = await determineNextCaseStatus(status3.name);
    expect(result).toEqual(extractRelevantAttributes(status4));
  });

  test("should return null when passed status4", async () => {
    const result = await determineNextCaseStatus(status4.name);
    expect(result).toBeFalsy();
  });
});
