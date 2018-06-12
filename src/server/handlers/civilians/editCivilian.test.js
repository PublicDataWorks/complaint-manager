import Case from "../../../client/testUtilities/case";
import Address from "../../../client/testUtilities/Address";
import Civilian from "../../../client/testUtilities/civilian";

const editCivilian = require("./editCivilian");
const models = require("../../models/index");
const httpMocks = require("node-mocks-http");

describe("editCivilian handler editing civilian with no address", () => {
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

  test("should create, not update, an address when no address ID given", async () => {
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

    const existingCase = await models.cases.create(caseAttributes, {
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          auditUser: "someone"
        }
      ],
      auditUser: "someone"
    });
    const existingCivilian = existingCase.dataValues.complainantCivilians[0];

    const initialAddressCount = await models.address.count();
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
          streetAddress: "123 Fleet Street",
          city: "Chicago"
        }
      },
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await editCivilian(request, response, jest.fn());
    await existingCivilian.reload({ include: [models.address] });

    const updatedAddressCount = await models.address.count();

    expect(existingCivilian.address).toEqual(
      expect.objectContaining({
        streetAddress: "123 Fleet Street",
        city: "Chicago"
      })
    );
    expect(updatedAddressCount).toEqual(initialAddressCount + 1);
  });
});

describe("editCivilian handler editing civilian with an address", () => {
  let existingCase, existingCivilian;
  const initalCity = "Chicago";

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
      .withCity(initalCity)
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

  test("should update, not create, an address when address ID given", async () => {
    const initialAddressCount = await models.address.count();
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

    const updatedAddressCount = await models.address.count();
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
    expect(updatedAddressCount).toEqual(initialAddressCount);
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

  test("should call next when missing civilian id", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      body: {},
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await editCivilian(request, response, next);
    expect(next).toHaveBeenCalled();
  });

  test("should not update civilian address or case status if civilian update fails", async () => {
    const fieldsToUpdate = { address: { city: "San Jose" }, caseId: null };

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: {
        id: existingCivilian.id
      },
      body: fieldsToUpdate,
      nickname: "TEST_USER_NICKNAME"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();
    await editCivilian(request, response, next);
    await existingCivilian.reload({ include: [models.address] });
    await existingCase.reload();

    expect(existingCivilian.address.city).toEqual(initalCity);
    expect(existingCase.status).toEqual("Initial");
  });
});
