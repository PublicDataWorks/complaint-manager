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
  CASE_STATUS,
  ISO_DATE,
  QUERY_TYPES
} from "../../../../sharedUtilities/constants";
import moment from "moment";

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

  let firstDistrict, secondDistrict, fifthDistrict;
  beforeEach(async () => {
    firstDistrict = await models.district.create(
      new District.Builder().withName("1st District")
    );

    secondDistrict = await models.district.create(
      new District.Builder().withName("2nd District")
    );

    await models.district.create(
      new District.Builder().withName("3rd District")
    );

    await models.district.create(
      new District.Builder().withName("4th District")
    );

    fifthDistrict = await models.district.create(
      new District.Builder().withName("5th District")
    );

    const firstCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment().subtract(3, "months"))
        .withCaseDistrict(firstDistrict)
        .withDistrictId(firstDistrict.id)
        .withId(undefined),
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
        .withDistrictId(secondDistrict.id),
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
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED);
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
      expect(response.body).toEqual([
        { district: "1st District", count: 1 },
        { district: "2nd District", count: 1 },
        { district: "5th District", count: 1 }
      ]);
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
      expect(response.body).toEqual([
        { district: "1st District", count: 1 },
        { district: "2nd District", count: 1 },
        { district: "5th District", count: 1 }
      ]);
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
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual([
        { district: "1st District", count: 1 },
        { district: "2nd District", count: 1 },
        { district: "5th District", count: 1 }
      ]);
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
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual([
        { district: "1st District", count: 1 },
        { district: "2nd District", count: 1 },
        { district: "5th District", count: 1 }
      ]);
    });
  });
});
