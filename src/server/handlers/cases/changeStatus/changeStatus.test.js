import { cleanupDatabase } from "../../../testHelpers/requestTestHelpers";
import { createCaseWithoutCivilian } from "../../../testHelpers/modelMothers";
import changeStatus from "./changeStatus";
import {
  CASE_STATUS,
  AUDIT_ACTION,
  AUDIT_SUBJECT,
  AUDIT_TYPE
} from "../../../../sharedUtilities/constants";
import httpMocks from "node-mocks-http";
import Boom from "boom";
import models from "../../../models/index";

describe("changeStatus", async () => {
  let initialCase, response, next;

  beforeEach(async () => {
    initialCase = await createCaseWithoutCivilian();
    next = jest.fn();
    response = httpMocks.createResponse();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should update case status", async () => {
    const newStatus = CASE_STATUS.ACTIVE;
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        id: initialCase.id
      },
      body: {
        status: newStatus
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);
    await initialCase.reload();

    expect(initialCase.status).toEqual(CASE_STATUS.ACTIVE);
  });

  test("should call next with error if given unknown status", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        id: initialCase.id
      },
      body: {
        status: "BLAH"
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);
    await initialCase.reload();

    expect(next).toBeCalledWith(Boom.badRequest("Invalid case status"));
    expect(initialCase.status).toEqual(CASE_STATUS.INITIAL);
  });

  test("should call next with error if case not found", async () => {
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        id: initialCase.id + 5
      },
      body: {
        status: CASE_STATUS.ACTIVE
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);
    await initialCase.reload();

    expect(next).toBeCalledWith(
      Boom.badRequest(`Case #${initialCase.id + 5} doesn't exist`)
    );
  });

  test("should audit case details", async () => {
    const newStatus = CASE_STATUS.ACTIVE;
    const request = httpMocks.createRequest({
      method: "PUT",
      params: {
        id: initialCase.id
      },
      body: {
        status: newStatus
      },
      nickname: "someone"
    });

    await changeStatus(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: initialCase.id }
    });

    expect(actionAudit).toEqual(
      expect.objectContaining({
        user: "someone",
        action: AUDIT_ACTION.DATA_ACCESSED,
        auditType: AUDIT_TYPE.DATA_ACCESS,
        subject: AUDIT_SUBJECT.CASE_DETAILS,
        caseId: initialCase.id
      })
    );
  });
});
