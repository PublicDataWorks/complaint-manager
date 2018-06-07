import Case from "../../../client/testUtilities/case";
import Address from "../../../client/testUtilities/address";
import Civilian from "../../../client/testUtilities/civilian";

const editCivilian = require("./editCivilian");
const models = require("../../models/index");
const httpMocks = require("node-mocks-http");

describe("editCivilian handler", () => {
  let existingCase, existingCivilian;
  beforeEach(async () => {
    const civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withId(undefined)
      .withNoAddress()
      .withRoleOnCase("Complainant")
      .build();

    const caseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withIncidentLocation(undefined)
      .withComplainantCivilians([civilianAttributes])
      .build();

    existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
    existingCivilian = existingCase.dataValues.complainantCivilians[0];
    const address = new Address.Builder()
      .defaultAddress()
      .withAddressableId(existingCivilian.id)
      .withAddressableType("civilian")
      .withId(undefined)
      .build();
    await existingCivilian.createAddress(address, { auditUser: "someone" });
    await existingCivilian.reload({ include: [models.address] });
  });

  afterEach(async () => {
    await models.address.truncate({ auditUser: "test user", force: true });
    await models.civilian.truncate({ auditUser: "test user" });
    await models.cases.truncate({
      cascade: true,
      force: true,
      auditUser: "test user"
    });
    await models.data_change_audit.truncate();
  });

  test("should update an address", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: {
        address: {
          id: existingCivilian.address.id,
          streetAddress: "123 Fleet Street",
          city: "Chicago"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await editCivilian(request, response, jest.fn());
    const updatedAddress = await models.address.find({
      where: {
        id: existingCivilian.address.id
      }
    });
    expect(updatedAddress).toEqual(
      expect.objectContaining({
        streetAddress: "123 Fleet Street",
        city: "Chicago"
      })
    );
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
