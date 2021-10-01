import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import models from "../../policeDataManager/models";
import getGenderIdentities from "./getGenderIdentities";

const httpMocks = require("node-mocks-http");

describe("getGenderIdentities", () => {
  let request, response, next;

  beforeEach(() => {
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

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  test("returns list of gender identities to populate dropdown", async () => {
    const transMale = await models.gender_identity.create({
      name: "Trans Male"
    });
    const transFemale = await models.gender_identity.create({
      name: "Trans Female"
    });
    const unknownGenderIdentity = await models.gender_identity.create({
      name: "Unknown"
    });

    await getGenderIdentities(request, response, next);

    expect(response._getData().length).toEqual(3);
    expect(response._getData()).toEqual(
      expect.arrayContaining([
        [transFemale.name, transFemale.id],
        [transMale.name, transMale.id],
        [unknownGenderIdentity.name, unknownGenderIdentity.id]
      ])
    );
  });
});
