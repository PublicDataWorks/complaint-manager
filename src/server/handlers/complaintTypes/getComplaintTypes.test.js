import {
  buildTokenWithPermissions,
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

describe("getComplaintTypes", () => {
  afterAll(async () => {
    await models.sequelize.close();
  });

  test("returns a list of complaint types to populate dropdown", async () => {
    const token = buildTokenWithPermissions("", "tuser");
    const responsePromise = request(app)
      .get("/api/complaint-types")
      .set("Content-Header", "application/json")
      .set("Authorization", `Bearer ${token}`);

    await expectResponse(
      responsePromise,
      200,
      expect.arrayContaining([
        {
          name: CIVILIAN_INITIATED
        },
        {
          name: RANK_INITIATED
        },
        {
          name: CIVILIAN_WITHIN_PD_INITIATED
        }
      ])
    );
  });
});
