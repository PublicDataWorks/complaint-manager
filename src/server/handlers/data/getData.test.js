import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions, cleanupDatabase, expectResponse
} from "../../testHelpers/requestTestHelpers";
import getData from "./getData";

const MOCK_QUERY_DATA_VALUES = [
    { cases: "2", name: "Email" },
    { cases: "5", name: "Facebook" },
    { cases: "3", name: "Other" }
];

jest.mock("./getData", () =>
  jest.fn((request, response, next) => {
    response.status(200).send(MOCK_QUERY_DATA_VALUES);
  })
);

describe("getData", () => {

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should call getData when countComplaintsByIntakeSource query called", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const responsePromise = request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });
    
    await expectResponse(responsePromise, 200, MOCK_QUERY_DATA_VALUES);
    expect(getData).toHaveBeenCalled();
  });
});
