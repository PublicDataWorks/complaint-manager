import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import Case from "../../../../sharedTestHelpers/case";
import Address from "../../../../sharedTestHelpers/Address";
import { executeQuery } from "./locationData";
import { updateCaseStatus } from "./queryHelperFunctions";

describe("locationDataQuery", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    const case1 = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2021-01-05")
        .withId(1),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(case1, CASE_STATUS.CLOSED);

    const case2 = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2021-03-05")
        .withId(2),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(case2, CASE_STATUS.CLOSED);

    const case3 = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2021-05-05")
        .withId(3),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(case3, CASE_STATUS.CLOSED);

    await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withId(1)
        .withAddressableType("cases")
        .withAddressableId(case1.id)
        .withLat(21)
        .withLng(-91),
      {
        auditUser: "someone"
      }
    );

    await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withId(2)
        .withAddressableType("cases")
        .withAddressableId(case2.id)
        .withLat(22)
        .withLng(-92),
      {
        auditUser: "someone"
      }
    );

    await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withId(3)
        .withAddressableType("cases")
        .withAddressableId(case3.id)
        .withLat(23)
        .withLng(-93),
      {
        auditUser: "someone"
      }
    );
  });

  test("should return lat/lon of first two cases when minDate is 01-01 and maxDate is 04-01", async () => {
    expect(
      await executeQuery({ minDate: "2021-01-01", maxDate: "2021-04-01" })
    ).toEqual([
      { lat: 21, lon: -91 },
      { lat: 22, lon: -92 }
    ]);
  });

  test("should return lat/lon of case2 and case3 when 2021-02-05 is passed", async () => {
    expect(await executeQuery({ minDate: "2021-02-05" })).toEqual([
      { lat: 22, lon: -92 },
      { lat: 23, lon: -93 }
    ]);
  });

  test("should return lat/lon of case3 when 2021-04-05 is passed", async () => {
    expect(await executeQuery({ minDate: "2021-04-05" })).toEqual([
      { lat: 23, lon: -93 }
    ]);
  });

  test("should return an empty array when 2021-06-05 is passed", async () => {
    expect(await executeQuery({ minDate: "2021-06-05" })).toEqual([]);
  });
});
