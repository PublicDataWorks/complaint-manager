import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../../../testHelpers/requestTestHelpers";
import app from "../../../../server";
import models from "../../../../policeDataManager/models";
import request from "supertest";

jest.mock(
  "../../../../getFeaturesAsync",
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

describe("getOfficerHistoryOptions", function () {
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("it retrieves the officer history options", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const recruitOption = await models.officer_history_option.create({
      name: "recruit"
    });
    const noHistoryOption = await models.officer_history_option.create({
      name: "no history"
    });
    const historyOption = await models.officer_history_option.create({
      name: "very noteworthy"
    });

    const expectedResponseBody = [
      { id: recruitOption.id, name: recruitOption.name },
      { id: noHistoryOption.id, name: noHistoryOption.name },
      { id: historyOption.id, name: historyOption.name }
    ];

    const responsePromise = request(app)
      .get("/api/officer-history-options")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(responsePromise, 200, expectedResponseBody);
  });
});
