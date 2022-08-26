import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import request from "supertest";
import Case from "../../../../sharedTestHelpers/case";
import CaseStatus from "../../../../sharedTestHelpers/caseStatus";
import app from "../../../server";
import { updateCaseStatus } from "./queryHelperFunctions";
import { CASE_STATUS, ISO_DATE } from "../../../../sharedUtilities/constants";
import CaseTag from "../../../testHelpers/caseTag";
import Tag from "../../../testHelpers/tag";
import moment from "moment";

describe("executeQuery", () => {
  const token = buildTokenWithPermissions("", "tuser");

  const expectedData = [
    { name: "karancitoooooo", count: "1" },
    { name: "sabs", count: "1" },
    { name: "Tofu", count: "2" },
    { name: "Chicago hot dogs", count: "3" }
  ];

  const responsePromise = request(app)
    .get("/api/public-data")
    .set("Content-Header", "application/json")
    .set("Authorization", `Bearer ${token}`)
    .query({
      queryType: "countTop10Tags",
      minDate: moment().subtract(12, "months").format(ISO_DATE)
    });

  const todaysDate = new Date();

  beforeEach(async () => {
    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const firstCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(3, "month"))
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(firstCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    const secondCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(5, "month")),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(secondCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    const thirdCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(12, "month"))
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(thirdCase, CASE_STATUS.CLOSED);

    const hotDogTag = await models.tag.create(
      new Tag.Builder().defaultTag().withName("Chicago hot dogs"),
      {
        auditUser: "someone"
      }
    );

    const karanTag = await models.tag.create(
      new Tag.Builder().defaultTag().withName("karancitoooooo"),
      {
        auditUser: "someone"
      }
    );

    const sabTag = await models.tag.create(
      new Tag.Builder().defaultTag().withName("sabs"),
      {
        auditUser: "someone"
      }
    );

    const tofuTag = await models.tag.create(
      new Tag.Builder().defaultTag().withName("Tofu"),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(firstCase.id)
        .withTagId(tofuTag.id),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(firstCase.id)
        .withTagId(hotDogTag.id),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(firstCase.id)
        .withTagId(karanTag.id),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(secondCase.id)
        .withTagId(hotDogTag.id),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(secondCase.id)
        .withTagId(sabTag.id),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(thirdCase.id)
        .withTagId(tofuTag.id),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(thirdCase.id)
        .withTagId(hotDogTag.id),
      {
        auditUser: "someone"
      }
    );
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("returns count of tags broken down by complaints", async () => {
    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
  });

  test("should return tags from only cases where status is forwarded to agency or closed", async () => {
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
      CASE_STATUS.LETTER_IN_PROGRESS
    );

    const newTag = await models.tag.create(
      new Tag.Builder().defaultTag().withName("new"),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(letterInProgressCase.id)
        .withTagId(newTag.id),
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

  test("should return tags from only cases where first contact date is within the past 12 months", async () => {
    const case15MonthsAgo = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(15, "month"))
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(case15MonthsAgo, CASE_STATUS.LETTER_IN_PROGRESS);

    const newTag = await models.tag.create(
      new Tag.Builder().defaultTag().withName("new"),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(case15MonthsAgo.id)
        .withTagId(newTag.id),
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

  test("should return tags from only cases that are NOT archived", async () => {
    const archivedCase = await models.cases.create(
      new Case.Builder()
        .defaultCase()
        .withFirstContactDate(moment(todaysDate).subtract(2, "month"))
        .withId(undefined),
      {
        auditUser: "someone"
      }
    );

    const newTag = await models.tag.create(
      new Tag.Builder().defaultTag().withName("new"),
      {
        auditUser: "someone"
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(archivedCase.id)
        .withTagId(newTag.id),
      {
        auditUser: "someone"
      }
    );

    await updateCaseStatus(archivedCase, CASE_STATUS.FORWARDED_TO_AGENCY);

    await archivedCase.destroy({ auditUser: "someone" });

    await responsePromise.then(response => {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveLength(4);
      expect(response.body).toEqual(expect.arrayContaining(expectedData));
    });
  });
});
