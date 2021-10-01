import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import getTags from "./getTags";
import models from "../../policeDataManager/models";

const httpMocks = require("node-mocks-http");

describe("getTags", () => {
  const testUser = "Leia Organa";
  let request, response, next;

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer Token"
      },
      nickname: "nickname"
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  test("returns list of tags to populate dropdown sorted by alphabetical order", async () => {
    const secondTag = await models.tag.create(
      {
        name: "tofu"
      },
      {
        auditUser: testUser
      }
    );

    const thirdTag = await models.tag.create(
      {
        name: "tom"
      },
      {
        auditUser: testUser
      }
    );

    const firstTag = await models.tag.create(
      {
        name: "audrey"
      },
      {
        auditUser: testUser
      }
    );

    const expectedOrderedTags = [
      { name: firstTag.name, id: firstTag.id },
      { name: secondTag.name, id: secondTag.id },
      { name: thirdTag.name, id: thirdTag.id }
    ];

    await getTags(request, response, next);

    expect(response._getData()).toEqual(expectedOrderedTags);
  });
});
