import Case from "../../../client/testUtilities/case";
import Address from "../../../client/testUtilities/Address";
import Civilian from "../../../client/testUtilities/civilian";
import { cleanupDatabase } from "../../requestTestHelpers";

const httpMocks = require("node-mocks-http");
const models = require("../../models");
const editCase = require("./editCase");

describe("Edit Case", () => {
  let request,
    response,
    next,
    existingCase,
    valuesToUpdate,
    initialCaseAttributes,
    addressAttributes,
    civilianAttributes;

  const initialCityValue = "Old City";
  beforeEach(async () => {
    const sharedId = 55;
    civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withNoAddress()
      .withId(sharedId)
      .build();

    const incidentLocation = new Address.Builder()
      .defaultAddress()
      .withCity(initialCityValue)
      .withAddressableType("cases")
      .withAddressableId(undefined)
      .withId(undefined)
      .build();

    initialCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(sharedId)
      .withCreatedBy("ORIGINAL_USER")
      .withFirstContactDate("2017-01-01")
      .withIncidentTime("01:01")
      .withIncidentDate("2017-01-02")
      .withComplainantCivilians([civilianAttributes])
      .withIncidentLocation(incidentLocation);

    existingCase = await models.cases.create(initialCaseAttributes, {
      auditUser: "someone",
      include: [
        {
          model: models.civilian,
          auditUser: "test user",
          as: "complainantCivilians"
        },
        {
          model: models.address,
          as: "incidentLocation",
          auditUser: "test user"
        }
      ]
    });

    addressAttributes = new Address.Builder()
      .defaultAddress()
      .withAddressableId(sharedId)
      .withAddressableType("civilian")
      .withId(undefined)
      .build();

    await existingCase.complainantCivilians[0].createAddress(
      addressAttributes,
      { auditUser: "test user" }
    );

    valuesToUpdate = {
      firstContactDate: "2018-02-08",
      incidentTime: "17:42:00",
      incidentDate: "2018-03-16"
    };

    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: valuesToUpdate,
      nickname: "TEST_USER_NICKNAME"
    });
    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should update the case", async () => {
    await editCase(request, response, next);
    await existingCase.reload();
    expect(existingCase.dataValues.firstContactDate).toEqual("2018-02-08");
  });

  test("should send back case record on editing a case", async () => {
    await editCase(request, response, next);
    expect(response._getData()).toEqual(
      expect.objectContaining(valuesToUpdate)
    );
  });

  test("should not update address if the case fails to update", async () => {
    valuesToUpdate.status = null;
    valuesToUpdate.incidentLocation = { city: "New City" };
    request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: valuesToUpdate,
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(request, response, next);
    const updatedCase = await models.cases.findById(existingCase.id, {
      include: [{ model: models.address, as: "incidentLocation" }]
    });
    expect(updatedCase.incidentLocation.city).toEqual(initialCityValue);
  });

  test("should respond with 400 when required field (firstContactDate) is not provided", async () => {
    const requestWithoutFirstContactDate = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: {
        incidentLocation: { city: "New City" },
        incidentDateNew: "2018-03-16"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(requestWithoutFirstContactDate, response, next);

    expect(response.statusCode).toEqual(400);
    await existingCase.reload({
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: [models.address]
        },
        { model: models.address, as: "incidentLocation" }
      ]
    });
    expect(existingCase.incidentLocation.city).toEqual(initialCityValue);
  });

  test("should respond with 400 when firstContactDate is invalid date", async () => {
    const requestWithoutFirstContactDate = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: {
        firstContactDate: "",
        incidentLocation: { city: "New City" },
        incidentDateNew: "2018-03-16"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(requestWithoutFirstContactDate, response, next);

    expect(response.statusCode).toEqual(400);
    await existingCase.reload({
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: [models.address]
        },
        { model: models.address, as: "incidentLocation" }
      ]
    });
    expect(existingCase.incidentLocation.city).toEqual(initialCityValue);
  });

  test("should call next if error occurs on edit", async () => {
    await editCase({}, response, next);
    expect(next).toHaveBeenCalled();
  });

  test("should ignore included with createdBy or assignedTo", async () => {
    const requestWithCreatedBy = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: {
        firstContactDate: "2018-04-01",
        incidentTime: "17:42",
        incidentDateNew: "2018-03-16",
        createdBy: "Ihackedyou",
        assignedTo: "Ihackedyou"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(requestWithCreatedBy, response, next);

    expect(response.statusCode).toEqual(200);
    await existingCase.reload();

    expect(existingCase.dataValues.createdBy).toEqual("ORIGINAL_USER");
  });

  test("should change incident location and not change civilian address when incident location edited", async () => {
    valuesToUpdate = {
      firstContactDate: new Date(),
      incidentLocation: { id: existingCase.incidentLocation.id, city: "Durham" }
    };

    const request = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: valuesToUpdate,
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(request, response, next);
    await existingCase.reload({
      include: [
        {
          model: models.civilian,
          as: "complainantCivilians",
          include: [models.address]
        },
        { model: models.address, as: "incidentLocation" }
      ]
    });

    expect(existingCase.complainantCivilians[0].address.city).not.toEqual(
      "Durham"
    );
    expect(existingCase.incidentLocation.city).toEqual("Durham");
  });
});
