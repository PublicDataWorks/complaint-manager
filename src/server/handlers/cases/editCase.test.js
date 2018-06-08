import Case from "../../../client/testUtilities/case";
import Address from "../../../client/testUtilities/Address";
import Civilian from "../../../client/testUtilities/civilian";

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

  beforeEach(async () => {
    const sharedId = 55;
    civilianAttributes = new Civilian.Builder()
      .defaultCivilian()
      .withNoAddress()
      .withId(sharedId)
      .build();

    initialCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(sharedId)
      .withCreatedBy("ORIGINAL_USER")
      .withFirstContactDate("2017-01-01")
      .withIncidentTime("01:01")
      .withIncidentDate("2017-01-02")
      .withComplainantCivilians([civilianAttributes])
      .withIncidentLocation(undefined);

    existingCase = await models.cases.create(initialCaseAttributes, {
      auditUser: "someone",
      include: [
        {
          model: models.civilian,
          auditUser: "test user",
          as: "complainantCivilians"
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
    await models.address.truncate({ force: true, auditUser: "someone" });
    await models.civilian.truncate({ force: true, auditUser: "someone" });
    await models.cases.destroy({
      truncate: true,
      cascade: true,
      auditUser: "test user"
    });
    await models.data_change_audit.truncate();
  });

  test("should call update the case", async () => {
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
    valuesToUpdate.incidentLocation = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withStreetAddress("1234 Main St")
      .withNoAddressable()
      .build();
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
    expect(updatedCase.incidentLocation).toEqual(null);
  });

  test("should respond with 400 when required field (firstContactDate) is not provided", async () => {
    const requestWithoutFirstContactDate = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: {
        incidentTime: "17:42",
        incidentDateNew: "2018-03-16"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(requestWithoutFirstContactDate, response, next);

    expect(response.statusCode).toEqual(400);
    await existingCase.reload();
    expect(existingCase.dataValues.firstContactDate).toEqual(
      initialCaseAttributes.firstContactDate
    );
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
        incidentTime: "17:42",
        incidentDateNew: "2018-03-16"
      },
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(requestWithoutFirstContactDate, response, next);

    expect(response.statusCode).toEqual(400);
    await existingCase.reload();
    expect(existingCase.dataValues.firstContactDate).toEqual(
      initialCaseAttributes.firstContactDate
    );
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

  test("should not change civilian address when incident location edited", async () => {
    valuesToUpdate = {
      incidentLocation: { city: "Durham" }
    };

    const requestWithCreatedBy = httpMocks.createRequest({
      method: "PUT",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      params: { id: existingCase.id },
      body: valuesToUpdate,
      nickname: "TEST_USER_NICKNAME"
    });

    await editCase(requestWithCreatedBy, response, next);
    await existingCase.complainantCivilians[0].reload({
      include: [models.address]
    });
    expect(existingCase.complainantCivilians[0].address.city).not.toEqual(
      "Durham"
    );
  });
});
