import Case from "../../../../client/testUtilities/case";
import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
const {
  AUDIT_ACTION,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");
import { getCaseWithAllAssociations } from "../../getCaseHelpers";
const getCase = require("./getCase");
const models = require("../../../models");
const httpMocks = require("node-mocks-http");

jest.mock("../../getCaseHelpers");

describe("getCase", () => {
  let existingCase;
  beforeEach(async () => {
    const caseToCreate = new Case.Builder()
      .defaultCase()
      .withId(undefined)
      .build();

    existingCase = await models.cases.create(caseToCreate, {
      auditUser: "someone"
    });
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should audit when retrieving a case", async () => {
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await getCase(request, response, next);

    const actionAudit = await models.action_audit.findOne({
      where: { caseId: existingCase.id },
      returning: true
    });

    expect(actionAudit.user).toEqual("nickname");
    expect(actionAudit.action).toEqual(AUDIT_ACTION.DATA_ACCESSED);
    expect(actionAudit.subject).toEqual(AUDIT_SUBJECT.CASE_DETAILS);
    expect(actionAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(actionAudit.caseId).toEqual(existingCase.id);
  });

  test("should not audit if an error occurs while retrieving case", async () => {
    getCaseWithAllAssociations.mockImplementationOnce(() =>
      Promise.reject({ message: "mock error" })
    );

    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: existingCase.id },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await getCase(request, response, next);

    const actionAudit = await models.action_audit.findAll();
    expect(actionAudit.length).toEqual(0);
  });

  test("should not create audit record when accessing nonexistent case", async () => {
    const invalidId = existingCase.id + 20;
    const request = httpMocks.createRequest({
      method: "GET",
      headers: {
        authorization: "Bearer token"
      },
      params: { caseId: invalidId },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await getCase(request, response, next);

    const actionAudit = await models.action_audit.findAll();
    expect(actionAudit.length).toEqual(0);
  });
});
