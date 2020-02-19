import request from "supertest";
import app from "../../server";
import {
  buildTokenWithPermissions,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import { executeQuery } from "./queries/countComplaintsByIntakeSource";

describe("getData", () => {
  test("should call countComplaintsByIntakeSource.executeQuery", () => {
    const token = buildTokenWithPermissions("", "tuser");

    request(app)
      .get("/api/data")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .query({ queryType: "countComplaintsByIntakeSource" });

    // expect(responsePromise).toHaveBeenCalledWith(executeQuery);
    // done();
  });
});
