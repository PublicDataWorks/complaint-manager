import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import District from "../../../../sharedTestHelpers/District";
import app from "../../../server";
import { updateCaseStatus } from "./queryHelperFunctions";
import {
  ADDRESSABLE_TYPE,
  CASE_STATUS,
  ISO_DATE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
import moment from "moment";
import Address from "../../../../sharedTestHelpers/Address";
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

jest.mock(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants.js`, () => ({
  DISTRICTS_GEOJSON: undefined,
  PERSON_TYPE: {
    CIVILIAN: {},
    CIVILIAN_WITHIN_PD: {},
    KNOWN_OFFICER: {},
    UNKNOWN_OFFICER: {}
  }
}));

describe("executeQuery without GEOJSON", () => {
  const token = buildTokenWithPermissions("", "tuser");

  const responsePromise = request(app)
    .get("/api/public-data")
    .set("Content-Header", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .query({
      queryType: QUERY_TYPES.COUNT_COMPLAINTS_BY_DISTRICT,
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });

  let districtNames = [
    "1st District",
    "2nd District",
    "3rd District",
    "4th District",
    "5th District",
    "6th District",
    "7th District"
  ];

  const expectedOutput = [
    { district: districtNames[0], count: 1 },
    { district: districtNames[1], count: 1 },
    { district: districtNames[4], count: 1 }
  ];

  let firstDistrict, secondDistrict, fifthDistrict, statuses;
  beforeEach(async () => {
    statuses = await seedStandardCaseStatuses();

    firstDistrict = await models.district.create(
      new District.Builder().withName(districtNames[0])
    );

    secondDistrict = await models.district.create(
      new District.Builder().withName(districtNames[1])
    );

    await models.district.create(
      new District.Builder().withName(districtNames[2])
    );

    await models.district.create(
      new District.Builder().withName(districtNames[3])
    );

    fifthDistrict = await models.district.create(
      new District.Builder().withName(districtNames[4])
    );

    const firstCaseGeo = {};
    const firstCaseAddress = await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withLat(firstCaseGeo.lat)
        .withLng(firstCaseGeo.lon)
        .withAddressableId(77546624)
        .withAddressableType(ADDRESSABLE_TYPE.CASES),
      {
        auditUser: "someone"
      }
    );

    const firstCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(3, "months"))
        .withCaseDistrict(firstDistrict)
        .withDistrictId(firstDistrict.id)
        .withIncidentLocation(firstCaseAddress)
        .withId(77546624),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      firstCase,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    const secondCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(5, "months"))
        .withCaseDistrict(secondDistrict)
        .withDistrictId(secondDistrict.id)
        .withId(208934098),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      secondCase,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    const thirdCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(12, "months"))
        .withCaseDistrict(fifthDistrict)
        .withDistrictId(fifthDistrict.id)
        .withId(333334),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED, statuses);

    const fourthCaseGeo = {};
    const fourthCaseAddress = await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withLat(fourthCaseGeo.lat)
        .withLng(fourthCaseGeo.lon)
        .withAddressableId(23425)
        .withAddressableType(ADDRESSABLE_TYPE.CASES)
        .withId(39338),
      {
        auditUser: "someone"
      }
    );

    const fourthCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(12, "months"))
        .withId(23425)
        .withIncidentLocation(fourthCaseAddress),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(fourthCase, CASE_STATUS.CLOSED, statuses);

    const fifthCaseGeo = {};
    const fifthCaseAddress = await models.address.create(
      new Address.Builder()
        .defaultAddress()
        .withLat(fifthCaseGeo.lat)
        .withLng(fifthCaseGeo.lon)
        .withAddressableId(334)
        .withAddressableType(ADDRESSABLE_TYPE.CASES)
        .withId(11233),
      {
        auditUser: "someone"
      }
    );

    const fifthCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(12, "months"))
        .withId(334)
        .withIncidentLocation(fifthCaseAddress),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(fifthCase, CASE_STATUS.CLOSED, statuses);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("returns count of complaints broken down by district", async () => {
    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expectedOutput);
    });
  });

  test("should return district count from only cases where status is forwarded to agency or closed", async () => {
    const letterInProgressCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withCaseDistrict(firstDistrict)
        .withDistrictId(firstDistrict.id)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expectedOutput);
    });
  });

  test("should return district count from only cases where first contact date is within the past 12 months", async () => {
    const case15MonthsAgo = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(15, "months"))
        .withCaseDistrict(fifthDistrict)
        .withDistrictId(fifthDistrict.id)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      case15MonthsAgo,
      CASE_STATUS.LETTER_IN_PROGRESS,
      statuses
    );

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expectedOutput);
    });
  });

  test("should return district count from only cases that are NOT archived", async () => {
    const archivedCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(2, "months"))
        .withCaseDistrict(secondDistrict)
        .withDistrictId(secondDistrict.id)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      archivedCase,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    await archivedCase.destroy({ auditUser: "someone" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expectedOutput);
    });
  });
});
