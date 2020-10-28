import models from "../../policeDataManager/models";
import createCivilian from "./createCivilian";
import Case from "../../../sharedTestHelpers/case";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import {
  ADDRESSABLE_TYPE,
  AUDIT_SUBJECT,
  MANAGER_TYPE
} from "../../../sharedUtilities/constants";
import auditDataAccess from "../audits/auditDataAccess";
import { expectedCaseAuditDetails } from "../../testHelpers/expectedAuditDetails";

const httpMocks = require("node-mocks-http");

jest.mock("../audits/auditDataAccess");

describe("createCivilian handler", () => {
  let createdCase, civilianValues, request, next, response;

  beforeEach(async () => {
    const caseAttributes = new Case.Builder().defaultCase().build();
    createdCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    civilianValues = {
      firstName: "Test",
      lastName: "Name",
      phoneNumber: "1234567890",
      caseId: createdCase.id
    };

    request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: civilianValues,
      nickname: "TEST_USER_NICKNAME"
    });

    next = jest.fn();
    response = httpMocks.createResponse();
  });
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("auditing", () => {
    test("should audit case data access", async () => {
      const createdCase = await createTestCaseWithoutCivilian();
      civilianValues.caseId = createdCase.id;
      request.body = civilianValues;

      await createCivilian(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
        MANAGER_TYPE.COMPLAINT,
        AUDIT_SUBJECT.CASE_DETAILS,
        expectedCaseAuditDetails,
        expect.anything()
      );
    });
  });

  test("should not create an address when no address values given", async () => {
    await createCivilian(request, response, next);

    const createdCivilian = await models.civilian.findOne({
      where: { caseId: createdCase.id }
    });

    const civilianAddress = await models.address.findOne({
      where: {
        addressableId: createdCivilian.id,
        addressableType: ADDRESSABLE_TYPE.CIVILIAN
      }
    });

    expect(civilianAddress).toEqual(null);
  });

  test("should trim extra whitespace from fields: firstName, lastName", async () => {
    const civilianValues = {
      firstName: "      Test White-space ",
      lastName: "  O'Hare  ",
      phoneNumber: "1234567890",
      caseId: createdCase.id
    };

    request.body = civilianValues;

    await createCivilian(request, response, next);

    const createdCivilian = await models.civilian.findOne({
      where: { caseId: createdCase.id }
    });

    expect(createdCivilian.firstName).toEqual("Test White-space");
    expect(createdCivilian.lastName).toEqual("O'Hare");
  });
});
