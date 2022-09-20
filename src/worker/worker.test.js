import request from "supertest";
import workerApp from "./worker";
import {
  cleanupDatabase,
  expectResponse
} from "../server/testHelpers/requestTestHelpers";

describe("worker", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should respond with 503 when app is shutting down", async () => {
    workerApp.locals.shuttingDown = true;

    const responsePromise = request(workerApp)
      .get(`/export/job/`)
      .set("Authorization", `Bearer token`)
      .set("Content-Type", "multipart/form-data");

    await expectResponse(responsePromise, 503);

    workerApp.locals.shuttingDown = false;
  });
});
