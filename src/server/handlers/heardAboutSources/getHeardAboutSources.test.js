import {
  buildTokenWithPermissions,
  cleanupDatabase
} from "../../testHelpers/requestTestHelpers";
import models from "../../models";
import getHeardAboutSources from "./getHeardAboutSources";

const httpMocks = require("node-mocks-http");

jest.mock("../cases/export/jobQueue");

describe("getHeardAboutSources", () => {
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

  test("returns list of heard about sources to populate dropdown sorted by alphabetical order", async () => {
    const token = buildTokenWithPermissions("", "tuser");

    const friendHeardAboutSource = await models.heard_about_source.create({
      name: "Friend"
    });
    const outreachEventHeardAboutSource = await models.heard_about_source.create(
      {
        name: "Outreach Event"
      }
    );
    const nopdHeardAboutSource = await models.heard_about_source.create({
      name: "NOPD"
    });

    const expectedOrderedHeardAboutSourceValues = [
      [friendHeardAboutSource.name, friendHeardAboutSource.id],
      [nopdHeardAboutSource.name, nopdHeardAboutSource.id],
      [outreachEventHeardAboutSource.name, outreachEventHeardAboutSource.id]
    ];

    await getHeardAboutSources(request, response, next);

    expect(response._getData()).toEqual(expectedOrderedHeardAboutSourceValues);
  });
});
