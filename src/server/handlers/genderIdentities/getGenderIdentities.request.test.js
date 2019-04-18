import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import request from "supertest";
import app from "../../server";
import getGenderIdentities from "./getGenderIdentities";

const MOCK_GENDER_IDENTITY_VALUES = [
  ["gender_identity_name", "gender_identity_id"]
];

jest.mock("./getGenderIdentities", () =>
  jest.fn((request, response, next) => {
    response.status(200).send(MOCK_GENDER_IDENTITY_VALUES);
  })
);

describe("getGenderIdentities", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("hits endpoint that calls getGenderIdentities", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const responsePromise = request(app)
      .get("/api/gender-identities")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, MOCK_GENDER_IDENTITY_VALUES);
    expect(getGenderIdentities).toHaveBeenCalled();
  });
});
