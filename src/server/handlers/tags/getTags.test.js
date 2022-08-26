import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getTags from "./getTags";
import models from "../../policeDataManager/models";
import Case from "../../../sharedTestHelpers/case";
import CaseStatus from "../../../sharedTestHelpers/caseStatus";
import CaseTag from "../../testHelpers/caseTag";

const httpMocks = require("node-mocks-http");

describe("getTags", () => {
  const testUser = "Leia Organa";
  let request, response, next, firstTag, secondTag, thirdTag;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer Token"
      },
      nickname: "nickname"
    });

    await models.caseStatus.create(
      new CaseStatus.Builder().defaultCaseStatus().build(),
      { auditUser: "user" }
    );

    const case1 = await models.cases.create(
      new Case.Builder().defaultCase().build(),
      { auditUser: "user" }
    );

    const case2 = await models.cases.create(
      new Case.Builder().defaultCase().withId(8883).build(),
      { auditUser: "user" }
    );

    secondTag = await models.tag.create(
      {
        name: "tofu"
      },
      {
        auditUser: testUser
      }
    );

    thirdTag = await models.tag.create(
      {
        name: "tom"
      },
      {
        auditUser: testUser
      }
    );

    firstTag = await models.tag.create(
      {
        name: "audrey"
      },
      {
        auditUser: testUser
      }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withCaseId(case1.id)
        .withTagId(secondTag.id),
      { auditUser: "user" }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withId(938383)
        .withCaseId(case2.id)
        .withTagId(secondTag.id),
      { auditUser: "user" }
    );

    await models.case_tag.create(
      new CaseTag.Builder()
        .defaultCaseTag()
        .withId(88833)
        .withCaseId(case1.id)
        .withTagId(thirdTag.id),
      { auditUser: "user" }
    );

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("returns list of tags to populate dropdown sorted by alphabetical order", async () => {
    const expectedOrderedTags = [
      { name: firstTag.name, id: firstTag.id },
      { name: secondTag.name, id: secondTag.id },
      { name: thirdTag.name, id: thirdTag.id }
    ];

    await getTags(request, response, next);

    expect(response._getData()).toEqual(expectedOrderedTags);
  });

  describe("getting tags with count", () => {
    test("returns list of tags sorted by descending count", async () => {
      const expectedOrderedTags = [
        { name: secondTag.name, id: secondTag.id, count: "2" },
        { name: thirdTag.name, id: thirdTag.id, count: "1" },
        { name: firstTag.name, id: firstTag.id, count: "0" }
      ];

      request.params = {
        expand: "count"
      };

      await getTags(request, response, next);

      expect(response._getData()).toEqual(expectedOrderedTags);
    });

    test("returns list of tags sorted by reverse alphabetical order when getting count and reverse order is specified", async () => {
      const expectedOrderedTags = [
        { name: thirdTag.name, id: thirdTag.id, count: "1" },
        { name: secondTag.name, id: secondTag.id, count: "2" },
        { name: firstTag.name, id: firstTag.id, count: "0" }
      ];

      request.params = {
        expand: "count",
        sort: "desc.name"
      };
      await getTags(request, response, next);

      expect(response._getData()).toEqual(expectedOrderedTags);
    });

    test("returns list of tags sorted in alphabetical order when specified", async () => {
      const expectedOrderedTags = [
        { name: firstTag.name, id: firstTag.id, count: "0" },
        { name: secondTag.name, id: secondTag.id, count: "2" },
        { name: thirdTag.name, id: thirdTag.id, count: "1" }
      ];

      request.params = {
        expand: "count",
        sort: "name"
      };
      await getTags(request, response, next);

      expect(response._getData()).toEqual(expectedOrderedTags);
    });

    test("returns list of tags sorted by ascending count when specified", async () => {
      const expectedOrderedTags = [
        { name: firstTag.name, id: firstTag.id, count: "0" },
        { name: thirdTag.name, id: thirdTag.id, count: "1" },
        { name: secondTag.name, id: secondTag.id, count: "2" }
      ];

      request.params = {
        expand: "count",
        sort: "asc.count"
      };
      await getTags(request, response, next);

      expect(response._getData()).toEqual(expectedOrderedTags);
    });
  });
});
