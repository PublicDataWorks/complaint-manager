import request from "supertest";
import workerApp from "./worker";

describe("worker", () => {
  test("should respond with 503 when app is shutting down", async () => {
    workerApp.locals.shuttingDown = true;

    await request(workerApp)
      .get(`/export/job/`)
      .set("Authorization", `Bearer token`)
      .set("Content-Type", "multipart/form-data")
      .expect(503);

    workerApp.locals.shuttingDown = false;
  });
});
