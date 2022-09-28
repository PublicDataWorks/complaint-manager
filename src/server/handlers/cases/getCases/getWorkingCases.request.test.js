import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../../server";
import {
  DESCENDING,
  SORT_CASES_BY
} from "../../../../sharedUtilities/constants";
import getWorkingCases from "./getWorkingCases";

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

jest.mock("./getWorkingCases", () =>
  jest.fn((request, response, next) => {
    response.send();
  })
);

describe("getWorkingCases", () => {
  let token;

  const sortBy = SORT_CASES_BY.CASE_REFERENCE;
  const sortDirection = DESCENDING;

  beforeEach(async () => {
    token = buildTokenWithPermissions("", "some_nickname");
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("GET /cases", () => {
    test("should call getWorkingCases", async () => {
      await request(app)
        .get(`/api/cases?sortBy=${sortBy}&sortDirection=${sortDirection}`)
        .set("Content-Header", "application/json")
        .set("Authorization", `Bearer ${token}`);

      expect(getWorkingCases).toHaveBeenCalled();
    });
  });
});
