import {
  buildTokenWithPermissions,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../server";
import getCivilianTitles from "./getCivilianTitles";

const MOCK_CIVILIAN_TITLE_VALUES = [
  ["civilian_title_name", "civilian_title_id"]
];

jest.mock("./getCivilianTitles", () =>
  jest.fn((request, response, next) => {
    response.status(200).send(MOCK_CIVILIAN_TITLE_VALUES);
  })
);

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

describe("getCivilianTitles", () => {
  test("hits endpoint calling getCivilianTitles", async () => {
    const token = buildTokenWithPermissions("", "user");

    const responsePromise = request(app)
      .get("/api/civilian-titles")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, MOCK_CIVILIAN_TITLE_VALUES);
    expect(getCivilianTitles).toHaveBeenCalled();
  });
});
