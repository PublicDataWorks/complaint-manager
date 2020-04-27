import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../complaintManager/models";
import request from "supertest";
import { BAD_REQUEST_ERRORS } from "../../../../sharedUtilities/errorMessageConstants";
import Case from "../../../../client/complaintManager/testUtilities/case";
import app from "../../../server";
import { CASE_STATUS } from "../../../../sharedUtilities/constants";

describe("executeQuery", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });
  const token = buildTokenWithPermissions("", "tuser");

  const updateCaseStatus = async (caseToUpdate, status) => {
    const caseStatusList = [
      CASE_STATUS.ACTIVE,
      CASE_STATUS.LETTER_IN_PROGRESS,
      CASE_STATUS.READY_FOR_REVIEW,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      CASE_STATUS.CLOSED
    ];

    for (const caseStatus in caseStatusList) {
      await caseToUpdate.update(
        { status: caseStatusList[caseStatus] },
        { auditUser: "someone" }
      );
      if (caseStatusList[caseStatus] === status) {
        return;
      }
    }
    caseToUpdate.reload();
  };

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
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(emailIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(firstCase, CASE_STATUS.FORWARDED_TO_AGENCY);
    // firstCase.reload();

    const secondCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(secondCase, CASE_STATUS.FORWARDED_TO_AGENCY);
    //secondCase.reload();

    const thirdCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(facebookIntakeSource.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED);
    // thirdCase.reload();

    const fourthCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
        .withId(undefined)
        .withIntakeSourceId(otherIntakeSource.id),
      {
        auditUser: "someone"
      }
    );
    await updateCaseStatus(fourthCase, CASE_STATUS.CLOSED);
    // fourthCase.reload();
  });

  test("returns count of complaints broken down by Intake Source", async done => {
    const expectedData = [
      { cases: "1", name: "Email" },
      { cases: "2", name: "Facebook" },
      { cases: "1", name: "Other" }
    ];

    const responsePromise = request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
    done();
  });

  test("throws an error when query param is not supported", async done => {
    const unknownQueryType = "unknown";
    const token = buildTokenWithPermissions("", "tuser");

    request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: unknownQueryType })
      .expect(400)
      .then(response => {
        expect(response.body.message).toContain(
          BAD_REQUEST_ERRORS.DATA_QUERY_TYPE_NOT_SUPPORTED
        );
        done();
      });
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
      { cases: "1", name: "Email" },
      { cases: "2", name: "Facebook" },
      { cases: "1", name: "Other" }
    ];

    const responsePromise = request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
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
      { cases: "1", name: "Email" },
      { cases: "2", name: "Facebook" },
      { cases: "1", name: "Other" }
    ];

    const responsePromise = request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
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
      { cases: "1", name: "Email" },
      { cases: "2", name: "Facebook" },
      { cases: "1", name: "Other" }
    ];

    const responsePromise = request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(3);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
  });
});
