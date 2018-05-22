import Case from "../../../client/testUtilities/case";
import Address from "../../../client/testUtilities/Address";

const httpMocks = require("node-mocks-http");
const models = require("../../models");
const editCase = require("./editCase");

describe("Edit Case", () => {
  let request,
    response,
    next,
    existingCase,
    valuesToUpdate,
    initialCaseAttributes;

  beforeEach(async () => {
    initialCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .withFirstContactDate("2017-01-01")
      .withIncidentTime("01:01")
      .withIncidentDate("2017-01-02")
      .withIncidentLocation(undefined);
    existingCase = await models.cases.create(initialCaseAttributes, {
      auditUser: "someone"
    });

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
    valuesToUpdate.createdBy = null;
    valuesToUpdate.incidentLocation = new Address.Builder()
      .defaultAddress()
      .withId(undefined)
      .withStreetAddress("1234 Main St");
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
});
