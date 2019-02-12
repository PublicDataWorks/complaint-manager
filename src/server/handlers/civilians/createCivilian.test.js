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

const httpMocks = require("node-mocks-http");

describe("createCivilian handler", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should audit case data access", async () => {
    const createdCase = await createTestCaseWithoutCivilian();

    const civilianValues = {
      firstName: "Test",
      lastName: "Name",
      phoneNumber: "1234567890",
      caseId: createdCase.id
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: civilianValues,
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await createCivilian(request, response, jest.fn());

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
        action: AUDIT_ACTION.DATA_ACCESSED
      })
    );
  });

  test("should not create an address when no address values given", async () => {
    const caseAttributes = new Case.Builder().defaultCase().build();
    const createdCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const civilianValues = {
      firstName: "Test",
      lastName: "Name",
      phoneNumber: "1234567890",
      caseId: createdCase.id
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: civilianValues,
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await createCivilian(request, response, jest.fn());

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
    const caseAttributes = new Case.Builder().defaultCase().build();
    const createdCase = await models.cases.create(caseAttributes, {
      auditUser: "someone"
    });

    const civilianValues = {
      firstName: "      Test White-space ",
      lastName: "  O'Hare  ",
      phoneNumber: "1234567890",
      caseId: createdCase.id
    };

    const request = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: civilianValues,
      nickname: "TEST_USER_NICKNAME"
    });
    const response = httpMocks.createResponse();

    await createCivilian(request, response, jest.fn());

    const createdCivilian = await models.civilian.findOne({
      where: { caseId: createdCase.id }
    });

    expect(createdCivilian.firstName).toEqual("Test White-space");
    expect(createdCivilian.lastName).toEqual("O'Hare");
  });
});
