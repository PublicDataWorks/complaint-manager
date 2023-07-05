import Case from "../../../sharedTestHelpers/case";
import Address from "../../../sharedTestHelpers/Address";
import Civilian from "../../../sharedTestHelpers/civilian";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  MANAGER_TYPE,
  USER_PERMISSIONS
} from "../../../sharedUtilities/constants";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import { BAD_REQUEST_ERRORS } from "../../../sharedUtilities/errorMessageConstants";
import auditDataAccess from "../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../testHelpers/expectedAuditDetails";
import { seedStandardCaseStatuses } from "../../testHelpers/testSeeding";

const httpMocks = require("node-mocks-http");
const models = require("../../policeDataManager/models");
const editCase = require("./editCase");
const Boom = require("boom");

jest.mock("../audits/auditDataAccess");

describe("Edit Case", () => {
  let request,
    response,
    next,
    existingCase,
    valuesToUpdate,
    initialCaseAttributes,
    addressAttributes,
    civilianAttributes,
    statuses;

  const initialCityValue = "Old City";

  afterEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await models.sequelize.close();
  });

  beforeEach(async () => {
    await cleanupDatabase();
    statuses = await seedStandardCaseStatuses();
  });

  describe("case status update", function () {
    test("should set the status to active when you edit a case", async () => {
      valuesToUpdate = {
        firstContactDate: "2018-06-24",
        narrativeSummary: "a summary"
      };

      existingCase = await createTestCaseWithoutCivilian();
      request = httpMocks.createRequest({
        method: "PUT",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        params: { caseId: existingCase.id },
        body: valuesToUpdate,
        nickname: "TEST_USER_NICKNAME",
        permissions: USER_PERMISSIONS.EDIT_CASE
      });
      response = httpMocks.createResponse();

      next = jest.fn();

      await editCase(request, response, next);

      await existingCase.reload();
      expect(existingCase.narrativeSummary).toEqual(
        valuesToUpdate.narrativeSummary
      );
      expect(existingCase.statusId).toEqual(
        statuses.find(status => status.name === "Active").id
      );
    });
  });

  describe("case update", function () {
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

      response = httpMocks.createResponse();
      next = jest.fn();
    });
    describe("a non archived case", () => {
      test("should send back case record on editing a case", async () => {
        request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer SOME_MOCK_TOKEN"
          },
          params: { caseId: existingCase.id },
          body: valuesToUpdate,
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
        });

        await editCase(request, response, next);
        expect(response._getData()).toEqual(
          expect.objectContaining(valuesToUpdate)
        );
      });

      test("should be able to update complaint type and assigned to", async () => {
        const complaintType = await models.complaintTypes.create(
          { name: "Complaint" },
          { auditUser: "user" }
        );
        request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer SOME_MOCK_TOKEN"
          },
          params: { caseId: existingCase.id },
          body: {
            ...valuesToUpdate,
            complaintType: complaintType.name,
            assignedTo: "assignee@assigned.to.com"
          },
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
        });

        await editCase(request, response, next);
        expect(response._getData().complaintType).toEqual(complaintType.name);
        expect(response._getData().assignedTo).toEqual(
          "assignee@assigned.to.com"
        );
      });

      test("should ignore complaint type if it's not found", async () => {
        request = httpMocks.createRequest({
          method: "PUT",
          headers: {
            authorization: "Bearer SOME_MOCK_TOKEN"
          },
          params: { caseId: existingCase.id },
          body: {
            ...valuesToUpdate,
            complaintType: "Not an actual complaint type",
            assignedTo: "assignee@assigned.to.com"
          },
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
        });

        await editCase(request, response, next);
        expect(response._getData().complaintType).toBeUndefined();
        expect(response._getData().assignedTo).toEqual(
          "assignee@assigned.to.com"
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
          params: { caseId: existingCase.id },
          body: valuesToUpdate,
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
        });

        await editCase(request, response, next);
        const updatedCase = await models.cases.findByPk(existingCase.id, {
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
          params: { caseId: existingCase.id },
          body: {
            incidentLocation: { city: "New City" },
            incidentDateNew: "2018-03-16"
          },
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
        });

        await editCase(requestWithoutFirstContactDate, response, next);

        expect(next).toHaveBeenCalledWith(
          Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_FIRST_CONTACT_DATE)
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
          params: { caseId: existingCase.id },
          body: {
            firstContactDate: "",
            incidentLocation: { city: "New City" },
            incidentDateNew: "2018-03-16"
          },
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
        });

        await editCase(requestWithoutFirstContactDate, response, next);

        expect(next).toHaveBeenCalledWith(
          Boom.badRequest(BAD_REQUEST_ERRORS.INVALID_FIRST_CONTACT_DATE)
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
          params: { caseId: existingCase.id },
          body: {
            firstContactDate: "2018-04-01",
            incidentTime: "17:42",
            incidentDateNew: "2018-03-16",
            createdBy: "Ihackedyou",
            assignedTo: "Ihackedyou"
          },
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
        });

        await editCase(requestWithCreatedBy, response, next);

        await existingCase.reload();

        expect(existingCase.dataValues.createdBy).toEqual("ORIGINAL_USER");
        expect(existingCase.dataValues.firstContactDate).toEqual("2018-04-01");
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
          params: { caseId: existingCase.id },
          body: valuesToUpdate,
          nickname: "TEST_USER_NICKNAME",
          permissions: USER_PERMISSIONS.EDIT_CASE
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

      describe("auditing", () => {
        test("should audit case details access when case updated", async () => {
          await editCase(request, response, next);

          expect(auditDataAccess).toHaveBeenCalledWith(
            request.nickname,
            existingCase.id,
            MANAGER_TYPE.COMPLAINT,
            AUDIT_SUBJECT.CASE_DETAILS,
            expectedCaseAuditDetails,
            expect.anything()
          );
        });
      });
    });
  });
});
