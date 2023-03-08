import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  createTestCaseWithCivilian,
  createTestCaseWithoutCivilian
} from "../../../testHelpers/modelMothers";
import Address from "../../../../sharedTestHelpers/Address";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import models from "../index";

describe("address", () => {
  beforeEach(async () => {
    await cleanupDatabase();
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should trim extra whitespace from fields on save: streetAddress, streetAddress2, additionalLocationInfo", async () => {
    const initialCase = await createTestCaseWithoutCivilian();

    const addressToCreate = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withStreetAddress("   123 The mean streets  ")
      .withStreetAddress2("   Apartment 1337 ")
      .withAdditionalLocationInfo(" 3rd door down    ")
      .build();

    await initialCase.createIncidentLocation(addressToCreate, {
      auditUser: "someone"
    });
    await initialCase.reload();
    const createdIncidentLocation = await initialCase.getIncidentLocation();

    expect(createdIncidentLocation.streetAddress).toEqual(
      "123 The mean streets"
    );
    expect(createdIncidentLocation.streetAddress2).toEqual("Apartment 1337");
    expect(createdIncidentLocation.additionalLocationInfo).toEqual(
      "3rd door down"
    );
  });

  test("should not allow additionalLocationInfo to be set to null", async () => {
    const additionalLocationInfo = "This is more info about the location";
    const address = await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withAdditionalLocationInfo(additionalLocationInfo)
        .build(),
      { auditUser: "user" }
    );
    address.additionalLocationInfo = null;
    expect(address.additionalLocationInfo).toEqual(additionalLocationInfo);
  });
});
