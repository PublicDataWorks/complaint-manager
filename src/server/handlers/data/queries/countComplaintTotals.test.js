import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
import app from "../../../server";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";
import { updateCaseStatus } from "./queryHelperFunctions";
import moment from "moment";

describe("getCountByDateRange", () => {
  const fiveDaysAgo = moment().subtract(5, "d").format("YYYY-MM-DD");
  const fiveMonthsAgo = moment().subtract(5, "m").format("YYYY-MM-DD");

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });
  const token = buildTokenWithPermissions("", "tuser");
  const expectedData = { ytd: 2, previousYear: 2 };

  beforeEach(async () => {
    const firstCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveDaysAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(firstCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    const secondCase = await models.cases.create(
      new Case.Builder().defaultCase().withFirstContactDate(fiveDaysAgo),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(secondCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    const thirdCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED);

    const fourthCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(fourthCase, CASE_STATUS.CLOSED);
  });

  test("returns count of complaints broken down by year to date and previous year", async () => {
    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintTotals" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expectedData);
  });

  test("should return only cases within the current year to date or previous year", async () => {
    const oldCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2018-12-31")
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintTotals" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expectedData);
  });

  test("should return only cases where status is forwarded to agency or closed", async () => {
    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    const activeCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(activeCase, CASE_STATUS.ACTIVE);

    const letterInProgressCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      letterInProgressCase,
      CASE_STATUS.LETTER_IN_PROGRESS
    );

    const readyForReviewCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(readyForReviewCase, CASE_STATUS.READY_FOR_REVIEW);

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintTotals" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expectedData);
  });

  test("should return only cases that are NOT archived", async () => {
    const archivedCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(archivedCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    await archivedCase.destroy({ auditUser: "someone" });

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintTotals" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expectedData);
  });
});
