import models from "../../models";
import createCivilian from "./createCivilian";
import Case from "../../../client/testUtilities/case";
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { createTestCaseWithoutCivilian } from "../../testHelpers/modelMothers";
import {
  ADDRESSABLE_TYPE,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../sharedUtilities/constants";
import mockFflipObject from "../../testHelpers/mockFflipObject";
import auditDataAccess from "../auditDataAccess";
import {
  expectedCaseAuditDetails,
  expectedFormattedCaseAuditDetails
} from "../../testHelpers/expectedAuditDetails";

const httpMocks = require("node-mocks-http");

jest.mock("../auditDataAccess");

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

  describe("newAuditFeature is disabled", () => {
    test("should audit case data access", async () => {
      const createdCase = await createTestCaseWithoutCivilian();
      civilianValues.caseId = createdCase.id;
      request.body = civilianValues;
      request.fflip = mockFflipObject({ newAuditFeature: false });

      await createCivilian(request, response, next);

      const audit = await models.action_audit.findOne({
        where: {
          caseId: createdCase.id
        }
      });

      expect(audit).toEqual(
        expect.objectContaining({
          caseId: createdCase.id,
          user: "TEST_USER_NICKNAME",
          subject: AUDIT_SUBJECT.CASE_DETAILS,
          auditType: AUDIT_TYPE.DATA_ACCESS,
          action: AUDIT_ACTION.DATA_ACCESSED,
          auditDetails: expectedFormattedCaseAuditDetails
        })
      );
    });
  });

  describe("newAuditFeature is enabled", () => {
    test("should audit case data access", async () => {
      const createdCase = await createTestCaseWithoutCivilian();
      civilianValues.caseId = createdCase.id;
      request.body = civilianValues;
      request.fflip = mockFflipObject({ newAuditFeature: true });

      await createCivilian(request, response, next);

      expect(auditDataAccess).toHaveBeenCalledWith(
        request.nickname,
        createdCase.id,
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
