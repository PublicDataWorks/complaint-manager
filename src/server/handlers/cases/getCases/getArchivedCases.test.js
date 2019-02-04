import { createTestCaseWithCivilian } from "../../../testHelpers/modelMothers";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import getArchivedCases from "./getArchivedCases";
import {
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import models from "../../../models";
import Case from "../../../../client/testUtilities/case";
const httpMocks = require("node-mocks-http");

describe("getArchivedCases", () => {
  const auditUser = "testUser";
  let existingArchivedCase, request, response, next;
  beforeEach(async () => {
    existingArchivedCase = await createTestCaseWithCivilian();
    await existingArchivedCase.destroy({ auditUser: auditUser });

    request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      nickname: auditUser
    });

    response = httpMocks.createResponse();
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test.skip("should audit data access", async () => {
    getArchivedCases(request, response, next);

    const audit = await models.action_audit.findAll();

    expect(audit).toEqual(
      expect.objectContaining({
        auditType: AUDIT_TYPE.DATA_ACCESS,
        action: AUDIT_ACTION.DATA_ACCESSED,
        subject: AUDIT_SUBJECT.ALL_ARCHIVED_CASES,
        user: auditUser
      })
    );
  });

  test("should get all archived cases", async () => {
    await getArchivedCases(request, response, next);

    expect(response._getData().cases).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: existingArchivedCase.id })
      ])
    );

    expect(response._getData().cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          deletedAt: null
        })
      ])
    );
  });

  test("should not get unarchived case", async () => {
    const existingUnarchivedCaseAttributes = new Case.Builder()
      .defaultCase()
      .withId(undefined);
    const existingUnarchivedCase = await models.cases.create(
      existingUnarchivedCaseAttributes,
      {
        auditUser: auditUser
      }
    );

    await getArchivedCases(request, response, next);

    expect(response._getData().cases).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: existingUnarchivedCase.id })
      ])
    );
  });
});
