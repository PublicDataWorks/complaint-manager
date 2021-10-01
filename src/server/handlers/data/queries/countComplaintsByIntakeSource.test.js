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

describe("executeQuery", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });
  const token = buildTokenWithPermissions("", "tuser");

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

    const firstCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2021-01-05")
        .withId(undefined)
        .withIntakeSourceId(emailIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(firstCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    const secondCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2021-01-05")
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(secondCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    const thirdCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2021-01-05")
        .withId(undefined)
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED);

    const fourthCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2021-01-05")
        .withId(undefined)
        .withIntakeSourceId(otherIntakeSource.id),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(fourthCase, CASE_STATUS.CLOSED);
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
        .withFirstContactDate("2020-12-31")
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY);

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
        dateRangeType: "PAST_12_MONTHS"
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
    await updateCaseStatus(oldCase, CASE_STATUS.FORWARDED_TO_AGENCY);

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
        dateRangeType: "YTD"
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
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    const activeCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(activeCase, CASE_STATUS.ACTIVE);

    const letterInProgressCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
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
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(readyForReviewCase, CASE_STATUS.READY_FOR_REVIEW);

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
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(instagramIntakeSource.id),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(archivedCase, CASE_STATUS.FORWARDED_TO_AGENCY);

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
