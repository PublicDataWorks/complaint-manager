import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Officer from "../../../../sharedTestHelpers/Officer";
import Case from "../../../../sharedTestHelpers/case";
import CaseOfficer from "../../../../sharedTestHelpers/caseOfficer";
import app from "../../../server";
import { updateCaseStatus } from "./queryHelperFunctions";
import { CASE_STATUS, ISO_DATE } from "../../../../sharedUtilities/constants";
import OfficerAllegation from "../../../../sharedTestHelpers/OfficerAllegation";
import Allegation from "../../../../sharedTestHelpers/Allegation";
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
  let caseOfficer1,
    caseOfficer2,
    caseOfficer3,
    officer1,
    officer2,
    officer3,
    existingCase1,
    existingCase2,
    existingCase3,
    allegation1,
    allegation2,
    allegation3,
    allegation4,
    statuses;

  const todaysDate = new Date();

  afterEach(async function () {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  const expectedData = [
    {
      rule: "Test Rule A",
      directive: "AA",
      paragraph: "Test Paragraph A",
      count: "1"
    },
    {
      rule: "Test Rule B",
      directive: "BB",
      paragraph: "Test Paragraph B",
      count: "1"
    },
    {
      rule: "Test Rule C",
      directive: "CC",
      paragraph: "Test Paragraph C",
      count: "2"
    },
    {
      rule: "Test Rule D",
      directive: "DD",
      paragraph: "Test Paragraph D",
      count: "3"
    }
  ];

  const token = buildTokenWithPermissions("", "tuser");

  const responsePromise = request(app)
    .get("/api/public-data")
    .set("Content-Header", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .query({
      queryType: "countTop10Allegations",
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();

    existingCase1 = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withFirstContactDate(moment(todaysDate).subtract(3, "month")),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      existingCase1,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    existingCase2 = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(3, "month")),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      existingCase2,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    existingCase3 = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withId(undefined)
        .withFirstContactDate(moment(todaysDate).subtract(3, "month")),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(
      existingCase3,
      CASE_STATUS.FORWARDED_TO_AGENCY,
      statuses
    );

    officer1 = await models.officer.create(
      new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(201)
    );

    officer2 = await models.officer.create(
      new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(202)
    );

    officer3 = await models.officer.create(
      new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(203)
    );

    allegation1 = await models.allegation.create(
      new Allegation.Builder()
        .defaultAllegation()
        .withRule("Test Rule A")
        .withParagraph("Test Paragraph A")
        .withDirective("AA")
        .withId(undefined)
    );

    allegation2 = await models.allegation.create(
      new Allegation.Builder()
        .defaultAllegation()
        .withRule("Test Rule B")
        .withParagraph("Test Paragraph B")
        .withDirective("BB")
        .withId(undefined)
    );

    allegation3 = await models.allegation.create(
      new Allegation.Builder()
        .defaultAllegation()
        .withRule("Test Rule C")
        .withParagraph("Test Paragraph C")
        .withDirective("CC")
        .withId(undefined)
    );

    allegation4 = await models.allegation.create(
      new Allegation.Builder()
        .defaultAllegation()
        .withRule("Test Rule D")
        .withParagraph("Test Paragraph D")
        .withDirective("DD")
        .withId(undefined)
    );

    caseOfficer1 = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(existingCase1.id)
        .withOfficerId(officer1.id),
      { auditUser: "someone" }
    );

    caseOfficer2 = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(existingCase2.id)
        .withOfficerId(officer2.id),
      { auditUser: "someone" }
    );

    caseOfficer3 = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(existingCase3.id)
        .withOfficerId(officer3.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation1.id)
        .withCaseOfficerId(caseOfficer1.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation2.id)
        .withCaseOfficerId(caseOfficer1.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation3.id)
        .withCaseOfficerId(caseOfficer1.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation4.id)
        .withCaseOfficerId(caseOfficer1.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation3.id)
        .withCaseOfficerId(caseOfficer2.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation4.id)
        .withCaseOfficerId(caseOfficer2.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(allegation4.id)
        .withCaseOfficerId(caseOfficer3.id),
      { auditUser: "someone" }
    );
  });

  test("returns count of allegations broken down by officer", async () => {
    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
  });

  test("should return allegations from only cases where status is forwarded to agency or closed", async () => {
    const letterInProgressCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate("2020-02-21")
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

    const newOfficer = await models.officer.create(
      new Officer.Builder().defaultOfficer().withId(undefined)
    );

    const newAllegation = await models.allegation.create(
      new Allegation.Builder().defaultAllegation().withId(undefined),
      {
        auditUser: "someone"
      }
    );

    const newCaseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(letterInProgressCase.id)
        .withOfficerId(newOfficer.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(newAllegation.id)
        .withCaseOfficerId(newCaseOfficer.id),
      {
        auditUser: "someone"
      }
    );

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
  });

  test("should return Allegations from only cases where first contact date is within the past 12 months", async () => {
    const case15MonthsAgo = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(15, "month"))
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

    const newOfficer = await models.officer.create(
      new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(100)
    );

    const newAllegation = await models.allegation.create(
      new Allegation.Builder().defaultAllegation().withId(undefined),
      {
        auditUser: "someone"
      }
    );

    const newCaseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(case15MonthsAgo.id)
        .withOfficerId(newOfficer.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(newAllegation.id)
        .withCaseOfficerId(newCaseOfficer.id),
      {
        auditUser: "someone"
      }
    );

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
  });

  test("should return allegations from only cases that are NOT archived", async () => {
    const archivedCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(2, "month"))
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

    const newOfficer = await models.officer.create(
      new Officer.Builder()
        .defaultOfficer()
        .withId(undefined)
        .withOfficerNumber(101)
    );

    const newAllegation = await models.allegation.create(
      new Allegation.Builder().defaultAllegation().withId(undefined),
      {
        auditUser: "someone"
      }
    );

    const newCaseOfficer = await models.case_officer.create(
      new CaseOfficer.Builder()
        .defaultCaseOfficer()
        .withId(undefined)
        .withCaseId(archivedCase.id)
        .withOfficerId(newOfficer.id),
      { auditUser: "someone" }
    );

    await models.officer_allegation.create(
      new OfficerAllegation.Builder()
        .defaultOfficerAllegation()
        .withId(undefined)
        .withAllegationId(newAllegation.id)
        .withCaseOfficerId(newCaseOfficer.id),
      {
        auditUser: "someone"
      }
    );

    await archivedCase.destroy({ auditUser: "someone" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
  });
});
