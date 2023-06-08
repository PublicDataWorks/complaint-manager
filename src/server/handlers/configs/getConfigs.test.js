import {
  buildTokenWithPermissions,
  cleanupDatabase,
  expectResponse
} from "../../testHelpers/requestTestHelpers";
import app from "../../server";
import models from "../../policeDataManager/models";
import request from "supertest";
import {
  CIVILIAN_INITIATED,
  RANK_INITIATED
} from "../../../sharedUtilities/constants";
const {
  CIVILIAN_WITHIN_PD_INITIATED
} = require(`${process.env.REACT_APP_INSTANCE_FILES_DIR}/constants`);

describe("getConfigs", () => {
  afterAll(async () => {
    await models.sequelize.close();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await models.config.create({ name: "Config1", value: "1" });
    await models.config.create({ name: "Config2", value: "2" });
    await models.config.create({ name: "Config3", value: "3" });
  });

  test("returns a list of configs", async () => {
    const token = buildTokenWithPermissions("", "tuser");
    const responsePromise = request(app)
      .get("/api/configs")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expect.objectContaining({
        Config1: "1",
        Config2: "2",
        Config3: "3"
      })
    );
  });
});
