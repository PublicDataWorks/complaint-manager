import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import * as httpMocks from "node-mocks-http";
import Case from "../../../../sharedTestHelpers/case";
import CaseTag from "../../../testHelpers/caseTag";
import Tag from "../../../testHelpers/tag";
import Civilian from "../../../../sharedTestHelpers/civilian";
import searchCases from "./searchCases";
import { getResultsFromES } from "../../getResultsFromES";
import {
  ASCENDING,
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../../testHelpers/modelMothers";

jest.mock("../../getResultsFromES");

const createSearchRequest = (queryString, currentPage, sortBy, sortDirection) =>
  httpMocks.createRequest({
    method: "GET",
    headers: {
      authorization: "Bearer token"
    },
    query: { queryString, currentPage, sortBy, sortDirection },
    nickname: "nickname"
  });

describe("searchCases handler", function () {
  let createdCaseA, createdCaseB, request, response, next;

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();

    const tag3 = await models.tag.create(
      { name: "tag 3" },
      { auditUser: "someone" }
    );

    const tag2 = await models.tag.create(
      { name: "tag 2" },
      { auditUser: "someone" }
    );

    const tag1 = await models.tag.create(
      { name: "tag 1" },
      { auditUser: "someone" }
    );

    const civilian = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withCaseId(undefined)
      .build();

    const caseAttributesWithCC = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withComplainantCivilians([civilian])
      .build();

    const caseAttributesWithoutCC = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    createdCaseA = await models.cases.create(caseAttributesWithCC, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });

    createdCaseB = await models.cases.create(caseAttributesWithCC, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });

    const caseTag1 = new CaseTag.Builder()
      .withCaseId(createdCaseB.id)
      .withTagId(tag1.id)
      .build();

    const caseTag2 = new CaseTag.Builder()
      .withCaseId(createdCaseA.id)
      .withTagId(tag2.id)
      .build();

    const caseTag3 = new CaseTag.Builder()
      .withCaseId(createdCaseA.id)
      .withTagId(tag3.id)
      .build();

    await models.case_tag.create(caseTag1, {
      auditUser: "someone"
    });

    await models.case_tag.create(caseTag2, {
      auditUser: "someone"
    });

    await models.case_tag.create(caseTag3, {
      auditUser: "someone"
    });

    await models.cases.create(caseAttributesWithoutCC, {
      auditUser: "someone"
    });

    getResultsFromES.mockReturnValue([
      { case_id: createdCaseA.id, first_name: "Chuck", last_name: "Berry" },
      { case_id: createdCaseB.id, first_name: "Chuck", last_name: "Berry" },
      { case_id: createdCaseB.id, tag_name: "Chuck-e-Cheese " }
    ]);
  });

  afterEach(async () => {
    getResultsFromES.mockClear();
    await cleanupDatabase();
  });

  test("should only return case details for resulting caseIds from ES", async () => {
    request = createSearchRequest(
      "Chuck",
      1,
      SORT_CASES_BY.CASE_REFERENCE,
      DESCENDING
    );

    await searchCases(request, response, next);

    expect(getResultsFromES).toHaveBeenCalledTimes(1);
    expect(getResultsFromES).toHaveBeenCalledWith("Chuck", 1);
    expect(response._getData().totalRecords).toEqual(2);
    expect(response._getData().rows[1]).toEqual(
      expect.objectContaining({
        id: createdCaseA.id
      })
    );
  });

  test("should return rows and total records count in response", async () => {
    request = createSearchRequest(
      "Chuck",
      1,
      SORT_CASES_BY.CASE_REFERENCE,
      DESCENDING
    );

    await searchCases(request, response, next);

    expect(response._getData()).toEqual(
      expect.objectContaining({
        rows: expect.arrayContaining([
          expect.objectContaining({
            id: createdCaseA.id
          }),
          expect.objectContaining({
            id: createdCaseB.id
          })
        ]),
        totalRecords: expect.any(Number)
      })
    );
  });

  test("should sort cases by descending Case ID", async () => {
    request = createSearchRequest(
      "Chuck",
      1,
      SORT_CASES_BY.CASE_REFERENCE,
      DESCENDING
    );

    await searchCases(request, response, next);

    expect(getResultsFromES).toHaveBeenCalledTimes(1);
    expect(getResultsFromES).toHaveBeenCalledWith("Chuck", 1);
    expect(response._getData()).toEqual(
      expect.objectContaining({
        rows: [
          expect.objectContaining({
            id: createdCaseB.id
          }),
          expect.objectContaining({
            id: createdCaseA.id
          })
        ],
        totalRecords: expect.any(Number)
      })
    );
  });

  test("should sort cases by ascending Case ID", async () => {
    request = createSearchRequest(
      "Chuck",
      1,
      SORT_CASES_BY.CASE_REFERENCE,
      ASCENDING
    );

    await searchCases(request, response, next);

    expect(getResultsFromES).toHaveBeenCalledTimes(1);
    expect(getResultsFromES).toHaveBeenCalledWith("Chuck", 1);
    expect(response._getData()).toEqual(
      expect.objectContaining({
        rows: [
          expect.objectContaining({
            id: createdCaseA.id
          }),
          expect.objectContaining({
            id: createdCaseB.id
          })
        ],
        totalRecords: expect.any(Number)
      })
    );
  });

  test("should sort cases by descending tag names", async () => {
    request = createSearchRequest("Chuck", 1, SORT_CASES_BY.TAGS, DESCENDING);

    await searchCases(request, response, next);

    expect(getResultsFromES).toHaveBeenCalledTimes(1);
    expect(getResultsFromES).toHaveBeenCalledWith("Chuck", 1);
    expect(response._getData()).toEqual(
      expect.objectContaining({
        rows: [
          expect.objectContaining({
            id: createdCaseA.id,
            tagNames: ["tag 2", "tag 3"]
          }),
          expect.objectContaining({
            id: createdCaseB.id,
            tagNames: ["tag 1"]
          })
        ],
        totalRecords: expect.any(Number)
      })
    );
  });

  test("should return the cases for first page by default", async () => {
    request = createSearchRequest(
      "Chuck",
      null,
      SORT_CASES_BY.TAGS,
      DESCENDING
    );

    // Removes the currentPage to test defaulting
    delete request.query.currentPage;

    await searchCases(request, response, next);

    expect(getResultsFromES).toHaveBeenCalledTimes(1);
    expect(getResultsFromES).toHaveBeenCalledWith("Chuck", 1);
    expect(response._getData().rows).toHaveLength(2);
  });
  test("should return the cases for selected page", async () => {
    const currentPage = 2;
    const numberOfResults = 25;
    const casePromises = [];

    request = createSearchRequest(
      "Chuck",
      currentPage,
      SORT_CASES_BY.TAGS,
      DESCENDING
    );

    for (let index = 0; index < numberOfResults; index++) {
      const newTestCase = await createTestCaseWithoutCivilian();
      casePromises.push(newTestCase);
    }

    const mockSearchResults = casePromises.map(caseResult => {
      return {
        case_id: caseResult.id,
        first_name: "Test",
        last_name: "User"
      };
    });

    getResultsFromES.mockReturnValue(mockSearchResults);

    await searchCases(request, response, next);

    expect(getResultsFromES).toHaveBeenCalledTimes(1);
    expect(getResultsFromES).toHaveBeenCalledWith("Chuck", currentPage);
    expect(response._getData().rows).toHaveLength(5);

    expect(response._getData()).toEqual(
      expect.objectContaining({
        totalRecords: numberOfResults
      })
    );
  });
});
