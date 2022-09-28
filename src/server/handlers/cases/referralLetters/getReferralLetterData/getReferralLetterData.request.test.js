import models from "../../../../policeDataManager/models/index";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import request from "supertest";
import app from "../../../../server";
import Case from "../../../../../sharedTestHelpers/case";
import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs,
  expectResponse
} from "../../../../testHelpers/requestTestHelpers";
import { BAD_REQUEST_ERRORS } from "../../../../../sharedUtilities/errorMessageConstants";
import { seedStandardCaseStatuses } from "../../../../testHelpers/testSeeding";

jest.mock("nanoid", () => ({ nanoid: () => "uniqueTempId" }));

jest.mock(
  "../../../../getFeaturesAsync",
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

describe("GET /cases/:id/referral-letter", function () {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  let token, newCase, statuses;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");

    statuses = await seedStandardCaseStatuses();

    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    newCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    await newCase.update(
      { statusId: statuses.find(status => status.name === "Active").id },
      { auditUser: "test" }
    );
  });

  describe("case is letter in progress", () => {
    let referralLetter;
    beforeEach(async () => {
      await newCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Letter in Progress"
          ).id
        },
        { auditUser: "test" }
      );

      const referralLetterAttributes = new ReferralLetter.Builder()
        .defaultReferralLetter()
        .withId(undefined)
        .withCaseId(newCase.id);
      referralLetter = await models.referral_letter.create(
        referralLetterAttributes,
        { auditUser: "test" }
      );
    });

    test("it should get referral letter data", async () => {
      const expectedResponse = {
        id: referralLetter.id,
        caseId: newCase.id,
        letterOfficers: [],
        includeRetaliationConcerns: referralLetter.includeRetaliationConcerns,
        classifications: {}
      };

      const responsePromise = request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200, expectedResponse);
    });

    test("it returns 200 if case status is ready for review", async () => {
      await newCase.update(
        {
          statusId: statuses.find(status => status.name === "Ready for Review")
            .id
        },
        { auditUser: "test" }
      );
      const responsePromise = request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200);
    });

    test("it returns 200 if case status is forwarded to agency", async () => {
      await newCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Forwarded to Agency"
          ).id
        },
        { auditUser: "test" }
      );

      const responsePromise = request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200);
    });

    test("it returns 200 if case status is forwarded to agency", async () => {
      await newCase.update(
        {
          statusId: statuses.find(status => status.name === "Closed").id
        },
        { auditUser: "test" }
      );

      const responsePromise = request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200);
    });
  });

  test(
    "it returns 400 invalid case status if case status is prior to letter in progress",
    suppressWinstonLogs(async () => {
      const responsePromise = request(app)
        .get(`/api/cases/${newCase.id}/referral-letter`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(
        responsePromise,
        400,
        expect.objectContaining({
          message: BAD_REQUEST_ERRORS.INVALID_CASE_STATUS
        })
      );
    })
  );
});
