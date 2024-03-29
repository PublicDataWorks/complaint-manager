import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../index";
import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import Civilian from "../../../../sharedTestHelpers/civilian";
import Case from "../../../../sharedTestHelpers/case";
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

describe("civilian", () => {
  let statuses;
  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should NOT update case status when creating a civilian through a case association", async () => {
    const initialCase = await createTestCaseWithCivilian();

    const createdCivilians = await models.civilian.findAll();
    expect(createdCivilians.length).toEqual(1);
    expect(initialCase.statusId).toEqual(
      statuses.find(status => status.name === "Initial").id
    );
  });

  test("should not update values to null", async () => {
    const c4se = await models.cases.create(new Case.Builder().defaultCase(), {
      auditUser: "user"
    });
    const civilian = await models.civilian.create(
      new Civilian.Builder().defaultCivilian().withCaseId(c4se.id),
      { auditUser: "user" }
    );
    const {
      firstName,
      middleInitial,
      lastName,
      suffix,
      email,
      additionalInfo
    } = civilian.toJSON();
    civilian.firstName = null;
    civilian.middleInitial = null;
    civilian.lastName = null;
    civilian.suffix = null;
    civilian.email = null;
    civilian.additionalInfo = null;
    expect(civilian.firstName).toEqual(firstName);
    expect(civilian.middleInitial).toEqual(middleInitial);
    expect(civilian.lastName).toEqual(lastName);
    expect(civilian.suffix).toEqual(suffix);
    expect(civilian.email).toEqual(email);
    expect(civilian.additionalInfo).toEqual(additionalInfo);
  });
});
