import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import PublicDataVisualization from "../../testHelpers/PublicDataVisualization";
import getVisualizationConfigs from "./getVisualizationConfigs";

const httpMocks = require("node-mocks-http");

describe("getVisualizationConfigs", () => {
  let request, response, next, visualization, visualization2;
  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "GET"
    });

    visualization = await models.publicDataVisualization.create(
      new PublicDataVisualization.Builder()
        .defaultPublicDataVisualization()
        .withOrderKey(9)
        .build(),
      { auditUser: "user" }
    );

    visualization2 = await models.publicDataVisualization.create(
      new PublicDataVisualization.Builder()
        .defaultPublicDataVisualization()
        .withTitle("Does it?")
        .withSubtitle("Okay")
        .withOrderKey(7)
        .build(),
      { auditUser: "user" }
    );

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("returns all visualizations", async () => {
    await getVisualizationConfigs(request, response, next);

    expect(response._getData()).toEqual([
      expect.objectContaining({
        id: visualization2.id,
        title: visualization2.title
      }),
      expect.objectContaining({
        id: visualization.id,
        title: visualization.title
      })
    ]);
  });
});
