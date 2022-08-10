import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
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

const {
  DISTRICTS_GEOJSON
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants.js`);

const findCenter = coordinates => {
  let latSorted = coordinates.map(coord => coord[1]).sort();
  let longSorted = coordinates.map(coord => coord[0]).sort();

  return {
    lat: latSorted[0] + (latSorted.pop() - latSorted[0]) / 2,
    lon: longSorted[0] + (longSorted.pop() - longSorted[0]) / 2
  };
};

describe("executeQuery", () => {
  const token = buildTokenWithPermissions("", "tuser");

  const responsePromise = request(app)
    .get("/api/public-data")
    .set("Content-Header", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .query({
      queryType: QUERY_TYPES.COUNT_COMPLAINTS_BY_DISTRICT,
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });

  let districtNames = DISTRICTS_GEOJSON
    ? DISTRICTS_GEOJSON.features.map(feature => feature.properties.name)
    : [
      "1st District",
      "2nd District",
      "3rd District",
      "4th District",
      "5th District",
      "6th District",
      "7th District"
    ];

  const expectedOutput = [
    { district: districtNames[0], count: DISTRICTS_GEOJSON ? 2 : 1 },
    { district: districtNames[1], count: 1 },
    { district: districtNames[4], count: 1 }
  ];

  if (DISTRICTS_GEOJSON) {
    expectedOutput.push({ district: districtNames[6], count: 1 });
  }

  let firstDistrict, secondDistrict, fifthDistrict;
  beforeEach(async () => {
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

    const firstCaseGeo = DISTRICTS_GEOJSON
      ? findCenter(DISTRICTS_GEOJSON.features[3].geometry.coordinates[0])
      : {};
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

    await updateCaseStatus(firstCase, CASE_STATUS.FORWARDED_TO_AGENCY);

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

    await updateCaseStatus(secondCase, CASE_STATUS.FORWARDED_TO_AGENCY);

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

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED);

    const fourthCaseGeo = DISTRICTS_GEOJSON
      ? findCenter(DISTRICTS_GEOJSON.features[0].geometry.coordinates[0])
      : {};
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

    await updateCaseStatus(fourthCase, CASE_STATUS.CLOSED);

    const fifthCaseGeo = DISTRICTS_GEOJSON
      ? findCenter(DISTRICTS_GEOJSON.features[6].geometry.coordinates[0])
      : {};
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

    await updateCaseStatus(fifthCase, CASE_STATUS.CLOSED);
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
      expect(response.body).toHaveLength(DISTRICTS_GEOJSON ? 4 : 3);
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
      expect(response.body).toHaveLength(DISTRICTS_GEOJSON ? 4 : 3);
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

    await updateCaseStatus(case15MonthsAgo, CASE_STATUS.LETTER_IN_PROGRESS);

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(DISTRICTS_GEOJSON ? 4 : 3);
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

    await updateCaseStatus(archivedCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    await archivedCase.destroy({ auditUser: "someone" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(DISTRICTS_GEOJSON ? 4 : 3);
      expect(response.body).toEqual(expectedOutput);
    });
  });
});
