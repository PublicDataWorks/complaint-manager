import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import app from "../../../server";
import { ISO_DATE, CASE_STATUS } from "../../../../sharedUtilities/constants";
import { updateCaseStatus } from "./queryHelperFunctions";
import moment from "moment";
import { seedStandardCaseStatuses } from "../../../testHelpers/testSeeding";

jest.mock(
  "../../../getFeaturesAsync",
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

describe("getCountByDateRange", () => {
  const yesterday = moment().subtract(1, "days").format(ISO_DATE);
  const oneYearAgo = moment().subtract(1, "years").format(ISO_DATE);
  let statuses;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });
  const token = buildTokenWithPermissions("", "tuser");
  const expectedData = { ytd: 2, previousYear: 2 };

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();

    const firstCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(yesterday)
        .withId(undefined),
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
      new Case.Builder().defaultCase().withFirstContactDate(yesterday),
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
        .withFirstContactDate(oneYearAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED, statuses);

    const fourthCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(oneYearAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(fourthCase, CASE_STATUS.CLOSED, statuses);
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
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY, statuses);

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
        .withFirstContactDate(oneYearAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    const activeCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(oneYearAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(activeCase, CASE_STATUS.ACTIVE, statuses);

    const letterInProgressCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(oneYearAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      letterInProgressCase,
      CASE_STATUS.LETTER_IN_PROGRESS,
      statuses
    );

    const readyForReviewCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(oneYearAgo)
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      readyForReviewCase,
      CASE_STATUS.READY_FOR_REVIEW,
      statuses
    );

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
        .withFirstContactDate(oneYearAgo)
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

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintTotals" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual(expectedData);
  });
});
