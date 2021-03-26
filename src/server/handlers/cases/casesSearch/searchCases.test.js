import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import models from "../../../policeDataManager/models";
import * as httpMocks from "node-mocks-http";
import Case from "../../../../sharedTestHelpers/case";
import Civilian from "../../../../sharedTestHelpers/civilian";
import searchCases from "./searchCases";
import { getResultsFromES } from "../../getResultsFromES";

jest.mock("../../getResultsFromES");

describe("searchCases handler", function () {
  let createdCaseA, createdCaseB, request, response, next;

  beforeEach(async () => {
    response = httpMocks.createResponse();
    next = jest.fn();

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      query: {
        queryString: "Chuck E Berry",
        currentPage: 1
      },
      nickname: "nickname"
    });

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

    await models.cases.create(caseAttributesWithoutCC, {
      auditUser: "someone"
    });

    getResultsFromES.mockReturnValue([
      [
        { case_id: createdCaseA.id, first_name: "Chuck", last_name: "Berry" },
        { case_id: createdCaseB.id, first_name: "Chuck", last_name: "Berry" }
      ],
      2
    ]);
  });

  afterEach(async () => {
    getResultsFromES.mockClear();
    await cleanupDatabase();
  });

  test("should only return case details for resulting caseIds from ES", async () => {
    await searchCases(request, response, next);

    expect(getResultsFromES).toHaveBeenCalledTimes(1);
    expect(getResultsFromES).toHaveBeenCalledWith("Chuck E Berry", 1);
    expect(response._getData().totalRecords).toEqual(2);
    expect(response._getData().rows[0]).toEqual(
      expect.objectContaining({
        id: createdCaseA.id
      })
    );
  });

  test("should return rows and total records count in response", async () => {
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
});
