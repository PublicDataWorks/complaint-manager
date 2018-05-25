import Case from "../../../client/testUtilities/case";

const editCivilian = require("./editCivilian");
const models = require("../../models/index");
const httpMocks = require("node-mocks-http");

describe("editCivilian handler", () => {
  let existingCase, existingCivilian;
  beforeEach(async () => {
    await models.address.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.cases.destroy({ truncate: true, cascade: true });
    await models.civilian.destroy({ truncate: true });

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .build();

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: [models.address]
        }
      ],
      auditUser: "someone"
    });
    existingCivilian = existingCase.dataValues.complainantCivilians[0];
  });

  afterEach(async () => {
    await models.address.destroy({
      truncate: true,
      cascade: true,
      force: true
    });
    await models.cases.destroy({ truncate: true, cascade: true });
    await models.civilian.destroy({ truncate: true });
  });

  test("should update civilian with correct properties", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: {
        firstName: "Bob"
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await editCivilian(request, response, jest.fn());

    await existingCivilian.reload();
    expect(existingCivilian.firstName).toEqual("Bob");
  });

  test("should call next when something blows up", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      body: {}
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await editCivilian(request, response, next);
    expect(next).toHaveBeenCalled();
  });
});
