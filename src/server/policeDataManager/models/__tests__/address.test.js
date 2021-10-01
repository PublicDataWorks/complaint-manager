import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import {
  createTestCaseWithCivilian,
  createTestCaseWithoutCivilian
} from "../../../testHelpers/modelMothers";
import Address from "../../../../sharedTestHelpers/Address";
import {
  ADDRESSABLE_TYPE,
  CASE_STATUS
} from "../../../../sharedUtilities/constants";
import models from "../index";

describe("address", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("should update case status when adding an incident location", async () => {
    const initialCase = await createTestCaseWithoutCivilian();

    const addressToCreate = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withAddressableId(initialCase.id)
      .withAddressableType(ADDRESSABLE_TYPE.CASES)
      .withStreetAddress("very legit street. i mean it")
      .build();

    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);

    await initialCase.createIncidentLocation(addressToCreate, {
      auditUser: "someone"
    });
    await initialCase.reload();
    const createdIncidentLocation = await initialCase.getIncidentLocation();

    expect(createdIncidentLocation.streetAddress).toEqual(
      "very legit street. i mean it"
    );
    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should update case status when adding an civilian address", async () => {
    const initialCase = await createTestCaseWithCivilian();
    const caseCivilians = await initialCase.getComplainantCivilians();
    const civilian = caseCivilians[0];

    const addressToCreate = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withAddressableId(civilian.id)
      .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
      .withStreetAddress("very legit street. i mean it")
      .build();

    await civilian.createAddress(addressToCreate, {
      auditUser: "someone"
    });

    await civilian.reload({ include: [models.address] });
    await initialCase.reload();

    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
    expect(civilian.address.streetAddress).toEqual(
      "very legit street. i mean it"
    );
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
});
