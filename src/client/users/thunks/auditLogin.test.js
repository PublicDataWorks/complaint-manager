import nock from "nock";
import auditLogin from "./auditLogin";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("auditLogin", () => {
  test("should call audit endpoint with Logged In text", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/audit", { log: "Logged In" })
      .reply(201);

    await auditLogin();
  });
});
