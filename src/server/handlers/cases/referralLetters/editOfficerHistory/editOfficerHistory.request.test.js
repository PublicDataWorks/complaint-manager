import {
  buildTokenWithPermissions,
  cleanupDatabase,
  suppressWinstonLogs,
  expectResponse
} from "../../../../testHelpers/requestTestHelpers";
import models from "../../../../policeDataManager/models";
import Case from "../../../../../sharedTestHelpers/case";
import CaseOfficer from "../../../../../sharedTestHelpers/caseOfficer";
import Officer from "../../../../../sharedTestHelpers/Officer";
import ReferralLetter from "../../../../testHelpers/ReferralLetter";
import request from "supertest";
import app from "../../../../server";
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

describe("officer histories (letter officers with history notes)", () => {
  let statuses;
  beforeEach(async () => {
    statuses = await seedStandardCaseStatuses();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  const token = buildTokenWithPermissions("letter:setup", "some_nickname");
  let existingCase, referralLetter, caseOfficer;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().withId(undefined);
    existingCase = await models.cases.create(caseAttributes, {
      auditUser: "test"
    });

    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Active").id
      },
      { auditUser: "test" }
    );

    const referralLetterAttributes = new ReferralLetter.Builder()
      .defaultReferralLetter()
      .withId(undefined)
      .withCaseId(existingCase.id);
    referralLetter = await models.referral_letter.create(
      referralLetterAttributes,
      { auditUser: "test" }
    );

    const officerAttributes = new Officer.Builder()
      .defaultOfficer()
      .withId(undefined);

    const officer = await models.officer.create(officerAttributes, {
      auditUser: "test"
    });

    const caseOfficerAttributes = new CaseOfficer.Builder()
      .defaultCaseOfficer()
      .withId(undefined)
      .withOfficerId(officer.id)
      .withFirstName("SpongeBob")
      .withLastName("SquarePants")
      .withCaseId(existingCase.id);

    caseOfficer = await models.case_officer.create(caseOfficerAttributes, {
      auditUser: "test"
    });
  });

  test("saves the letter officers if they do not exist yet", async () => {
    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Letter in Progress")
          .id
      },
      { auditUser: "test" }
    );

    const requestBody = {
      letterOfficers: [
        {
          caseOfficerId: caseOfficer.id,
          fullName: caseOfficer.fullName,
          numHistoricalHighAllegations: 2,
          numHistoricalMedAllegations: 3,
          numHistoricalLowAllegations: 4,
          historicalBehaviorNotes: "<p>notes here</p>",
          referralLetterOfficerHistoryNotes: []
        }
      ]
    };

    const responsePromise = request(app)
      .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    await expectResponse(responsePromise, 200, {});

    const createdLetterOfficers = await models.letter_officer.findAll({
      where: { caseOfficerId: caseOfficer.id }
    });
    expect(createdLetterOfficers.length).toEqual(1);
    const createdLetterOfficer = createdLetterOfficers[0];
    expect(createdLetterOfficer.caseOfficerId).toEqual(caseOfficer.id);
    expect(createdLetterOfficer.numHistoricalHighAllegations).toEqual(2);
    expect(createdLetterOfficer.numHistoricalMedAllegations).toEqual(3);
    expect(createdLetterOfficer.numHistoricalLowAllegations).toEqual(4);
    expect(createdLetterOfficer.historicalBehaviorNotes).toEqual(
      "<p>notes here</p>"
    );
  });

  test("it returns 200 if case status is ready for review", async () => {
    await existingCase.update(
      {
        statusId: statuses.find(status => status.name === "Ready for Review").id
      },
      { auditUser: "test" }
    );

    const requestBody = {
      letterOfficers: []
    };

    const responsePromise = request(app)
      .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(requestBody);

    await expectResponse(responsePromise, 200);
  });

  test(
    "return 400 cannot edit archived case when updating officer history of archived case",
    suppressWinstonLogs(async () => {
      await existingCase.update(
        {
          statusId: statuses.find(status => status.name === "Ready for Review")
            .id
        },
        { auditUser: "test" }
      );

      await existingCase.destroy({ auditUser: "test" });

      const responsePromise = request(app)
        .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(
        responsePromise,
        400,
        expect.objectContaining({
          message: BAD_REQUEST_ERRORS.CANNOT_UPDATE_ARCHIVED_CASE
        })
      );
    })
  );

  test(
    "it returns 200 if case status is is after ready for review",
    suppressWinstonLogs(async () => {
      await existingCase.update(
        {
          statusId: statuses.find(
            status => status.name === "Forwarded to Agency"
          ).id
        },
        { auditUser: "test" }
      );

      const responsePromise = request(app)
        .put(`/api/cases/${existingCase.id}/referral-letter/officer-history`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      await expectResponse(responsePromise, 200);
    })
  );
});
