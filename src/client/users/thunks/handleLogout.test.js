import nock from "nock";
import handleLogout from "./handleLogout";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

jest.mock("../../auth/getAccessToken", () => jest.fn(() => "TEST_TOKEN"));

const mockLogout = jest.fn();
jest.mock("../../auth/Auth", () => {
  return jest.fn().mockImplementation(() => {
    return { logout: mockLogout };
  });
});

describe("handleLogout", () => {
  test("should call Auth logout with request body", async () => {
    nock("http://localhost", {
      reqheaders: {
        "Content-Type": "application/json",
        Authorization: `Bearer TEST_TOKEN`
      }
    })
      .post("/api/audit", { log: AUDIT_ACTION.LOGGED_OUT })
      .reply(201);

    await handleLogout();

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
