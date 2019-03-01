import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import models from "../../models";
import getInitialDiscoverySources from "./getInitialDiscoverySources";

const httpMocks = require("node-mocks-http");

jest.mock("../cases/export/jobQueue");

describe("getInitialDiscoverySources", () => {
  let request, response, next;

  beforeEach(() => {
    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: "nickname"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("returns list of initial discovery sources to populate dropdown sorted by alphabetical order", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const friendInitialDiscoverySource = await models.initial_discovery_source.create(
      {
        name: "Friend"
      }
    );
    const outreachEventInitialDiscoverySource = await models.initial_discovery_source.create(
      {
        name: "Outreach Event"
      }
    );
    const nopdInitialDiscoverySource = await models.initial_discovery_source.create(
      {
        name: "NOPD"
      }
    );

    const expectedOrderedInitialDiscoverySourceValues = [
      [friendInitialDiscoverySource.name, friendInitialDiscoverySource.id],
      [nopdInitialDiscoverySource.name, nopdInitialDiscoverySource.id],
      [
        outreachEventInitialDiscoverySource.name,
        outreachEventInitialDiscoverySource.id
      ]
    ];

    await getInitialDiscoverySources(request, response, next);

    expect(response._getData()).toEqual(
      expectedOrderedInitialDiscoverySourceValues
    );
  });
});
