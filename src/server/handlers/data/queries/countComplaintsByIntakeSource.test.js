import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import app from "../../../server";
import { CASE_STATUS, ISO_DATE } from "../../../../sharedUtilities/constants";
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

describe("executeQuery", () => {
  const oneDayAgo = moment().subtract(1, "days").format(ISO_DATE);
  const fiveMonthsAgo = moment().subtract(5, "months").format(ISO_DATE);

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  const token = buildTokenWithPermissions("", "tuser");
  let statuses;

  beforeEach(async () => {
    const emailIntakeSource = await models.intake_source.create({
      name: "Email"
    });
    const facebookIntakeSource = await models.intake_source.create({
      name: "Facebook"
    });
    const otherIntakeSource = await models.intake_source.create({
      name: "Other"
    });

    statuses = await seedStandardCaseStatuses();

    const firstCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(oneDayAgo)
        .withId(undefined)
        .withIntakeSourceId(emailIntakeSource.id),
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
        .withFirstContactDate(oneDayAgo)
        .withIntakeSourceId(facebookIntakeSource.id),
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
        .withFirstContactDate(oneDayAgo)
        .withId(undefined)
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED, statuses);

    const fourthCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(oneDayAgo)
        .withId(undefined)
        .withIntakeSourceId(otherIntakeSource.id),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(fourthCase, CASE_STATUS.CLOSED, statuses);
  });

  test("returns count of complaints broken down by Intake Source", async () => {
    const expectedData = [
      { count: "1", name: "Email" },
      { count: "2", name: "Facebook" },
      { count: "1", name: "Other" }
    ];

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual(expect.arrayContaining(expectedData));
  });

  test("should return cases within the past 12 months", async () => {
    const instagramIntakeSource = await models.intake_source.create({
      name: "Instagram"
    });

    const oldCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY, statuses);

    const expectedData = [
      { count: "1", name: "Email" },
      { count: "2", name: "Facebook" },
      { count: "1", name: "Other" },
      { count: "1", name: "Instagram" }
    ];

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({
        queryType: "countComplaintsByIntakeSource",
        minDate: moment().subtract(12, "months").format(ISO_DATE)
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(4);
    expect(response.body).toEqual(expect.arrayContaining(expectedData));
  });

  test("should return only cases within the current year to date", async () => {
    const instagramIntakeSource = await models.intake_source.create({
      name: "Instagram"
    });

    const oldCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2019-12-31")
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY, statuses);

    const expectedData = [
      { count: "1", name: "Email" },
      { count: "2", name: "Facebook" },
      { count: "1", name: "Other" }
    ];

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({
        queryType: "countComplaintsByIntakeSource",
        minDate: `${moment().format("YYYY")}-01-01`
      });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual(expect.arrayContaining(expectedData));
  });

  test("should return only cases where status is forwarded to agency or closed", async () => {
    const instagramIntakeSource = await models.intake_source.create({
      name: "Instagram"
    });

    await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    const activeCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(activeCase, CASE_STATUS.ACTIVE, statuses);

    const letterInProgressCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
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
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      readyForReviewCase,
      CASE_STATUS.READY_FOR_REVIEW,
      statuses
    );

    const expectedData = [
      { count: "1", name: "Email" },
      { count: "2", name: "Facebook" },
      { count: "1", name: "Other" }
    ];

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual(expect.arrayContaining(expectedData));
  });

  test("should return only cases that are NOT archived", async () => {
    const instagramIntakeSource = await models.intake_source.create({
      name: "Instagram"
    });

    const archivedCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(fiveMonthsAgo)
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
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

    const expectedData = [
      { count: "1", name: "Email" },
      { count: "2", name: "Facebook" },
      { count: "1", name: "Other" }
    ];

    const response = await request(app)
      .get("/api/public-data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveLength(3);
    expect(response.body).toEqual(expect.arrayContaining(expectedData));
  });
});
