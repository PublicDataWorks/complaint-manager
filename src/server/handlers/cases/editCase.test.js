import Case from "../../../client/testUtilities/case";
import Address from "../../../client/testUtilities/Address";
import Civilian from "../../../client/testUtilities/civilian";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  AUDIT_SUBJECT,
  AUDIT_TYPE,
  CASE_STATUS,
  AUDIT_ACTION,
  ADDRESSABLE_TYPE
} from "../../../sharedUtilities/constants";
import { createCaseWithoutCivilian } from "../../testHelpers/modelMothers";

const httpMocks = require("node-mocks-http");
const models = require("../../models");
const editCase = require("./editCase");
const Boom = require("boom");

describe("Edit Case", () => {
  let request,
    response,
    next,
    existingCase,
    valuesToUpdate,
    initialCaseAttributes,
    addressAttributes,
    civilianAttributes,
    classificationBWC;

  const initialCityValue = "Old City";

  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("case status update", function() {
    test("should set the status to active when you edit a case", async () => {
      valuesToUpdate = {
        firstContactDate: "2018-06-24",
        narrativeSummary: "a summary"
      };

      existingCase = await createCaseWithoutCivilian();
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

      await editCase(request, response, next);

      await existingCase.reload();
      expect(existingCase.narrativeSummary).toEqual(
        valuesToUpdate.narrativeSummary
      );
      expect(existingCase.status).toEqual(CASE_STATUS.ACTIVE);
    });
  });

  describe("case update", function() {
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
        .withAddressableType(ADDRESSABLE_TYPE.CASES)
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

      classificationBWC = await models.classification.create({
        name: "Body Worn Camera",
        initialism: "BWC"
      });

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
        .withAddressableType(ADDRESSABLE_TYPE.CIVILIAN)
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

    test("should update the case", async () => {
      await editCase(request, response, next);
      await existingCase.reload();
      expect(existingCase.dataValues.firstContactDate).toEqual("2018-02-08");
    });

    test("should associate classification if given", async () => {
      request.body["classificationId"] = classificationBWC.id;
      await editCase(request, response, next);
      await existingCase.reload({
        include: [{ model: models.classification }]
      });
      expect(existingCase.dataValues.classificationId).toEqual(
        classificationBWC.id
      );
      expect(existingCase.dataValues.classification.values).toEqual(
        classificationBWC.values
      );
    });

    test("should change classification if different one given", async () => {
      await existingCase.update(
        { classificationId: classificationBWC.id },
        { auditUser: "someone" }
      );
      const classificationUTD = await models.classification.create({
        name: "Unable to Determine",
        initialism: "UTD"
      });
      request.body["classificationId"] = classificationUTD.id;
      await editCase(request, response, next);
      await existingCase.reload({
        include: [{ model: models.classification }]
      });
      expect(existingCase.dataValues.classificationId).toEqual(
        classificationUTD.id
      );
      expect(existingCase.dataValues.classification.values).toEqual(
        classificationUTD.values
      );
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

      expect(next).toHaveBeenCalledWith(
        Boom.badRequest("Valid first contact date is required")
      );

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

      expect(next).toHaveBeenCalledWith(
        Boom.badRequest("Valid first contact date is required")
      );
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
        incidentLocation: {
          id: existingCase.incidentLocation.id,
          city: "Durham"
        }
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

    test("should audit case details access when case updated", async () => {
      await editCase(request, response, next);

      const actionAudit = await models.action_audit.find({
        where: { caseId: existingCase.id },
        returning: true
      });

      expect(actionAudit).toEqual(
        expect.objectContaining({
          user: "TEST_USER_NICKNAME",
          action: AUDIT_ACTION.DATA_ACCESSED,
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          caseId: existingCase.id
        })
      );
    });
  });
});
