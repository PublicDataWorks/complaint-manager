import {
  buildTokenWithPermissions,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../server";
import getDistricts from "./getDistricts";

const MOCK_DISTRICTS_VALUES = [["13th District", 13]];

jest.mock(
  "../../getFeaturesAsync",
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

jest.mock("./getDistricts", () =>
  jest.fn((request, response, next) => {
    response.status(200).send(MOCK_DISTRICTS_VALUES);
  })
);

describe("getDistricts", () => {
  test("hits endpoint calling getDistricts", async () => {
    const token = buildTokenWithPermissions("", "user");

    const responsePromise = request(app)
      .get("/api/districts")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, MOCK_DISTRICTS_VALUES);
    expect(getDistricts).toHaveBeenCalled();
  });
});
