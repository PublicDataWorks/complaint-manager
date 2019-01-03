import nock from "nock";
import auditLogin from "./auditLogin";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";
import configureInterceptors from "../../axiosInterceptors/interceptors";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

describe("auditLogin", () => {
  configureInterceptors({});
  test("should call audit endpoint with Logged In text", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/audit", { log: AUDIT_ACTION.LOGGED_IN })
      .reply(201);

    await auditLogin();
  });
});
