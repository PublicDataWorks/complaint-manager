import mockFflipObject from "../../testHelpers/mockFflipObject";

const httpMocks = require("node-mocks-http");
const audit = require("./audit");
const models = require("../../models/index");
import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { AUDIT_ACTION, AUDIT_TYPE } from "../../../sharedUtilities/constants";

describe("Audit", () => {
  const currentUser = "test username";
  afterEach(async () => {
    await cleanupDatabase();
  });

  describe("newAuditFeature enabled", () => {
    let next;

    beforeEach(() => {
      next = jest.fn();
    });

    test("should create an audit record", async () => {
      const requestWithValidDataForAudit = httpMocks.createRequest({
        fflip: mockFflipObject({
          newAuditFeature: true
        }),
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: { log: AUDIT_ACTION.LOGGED_OUT },
        nickname: currentUser
      });

      const response = httpMocks.createResponse();
      await audit(requestWithValidDataForAudit, response, next);

      const createdAudits = await models.audit.findAll({ raw: true });
      expect(response.statusCode).toEqual(201);
      expect(createdAudits.length).toEqual(1);

      const expectedLog = {
        auditAction: AUDIT_ACTION.LOGGED_OUT,
        caseId: null,
        user: currentUser
      };
      expect(createdAudits[0]).toEqual(expect.objectContaining(expectedLog));
    });

    test("should create an audit record", async () => {
      const requestWithValidDataForAudit = httpMocks.createRequest({
        fflip: mockFflipObject({
          newAuditFeature: true
        }),
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: { log: AUDIT_ACTION.LOGGED_IN },
        nickname: currentUser
      });

      const response = httpMocks.createResponse();
      await audit(requestWithValidDataForAudit, response, next);

      const createdAudits = await models.audit.findAll({ raw: true });
      expect(response.statusCode).toEqual(201);
      expect(createdAudits.length).toEqual(1);

      const expectedLog = {
        auditAction: AUDIT_ACTION.LOGGED_IN,
        caseId: null,
        user: currentUser
      };
      expect(createdAudits[0]).toEqual(expect.objectContaining(expectedLog));
    });

    test("should not allow actions that we don't allow", async () => {
      const requestWithValidDataForAudit = httpMocks.createRequest({
        fflip: mockFflipObject({
          newAuditFeature: true
        }),
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: { log: "Was Awesome" },
        nickname: currentUser
      });

      const response = httpMocks.createResponse();
      await audit(requestWithValidDataForAudit, response, next);

      await models.audit.count().then(numAudits => {
        expect(numAudits).toEqual(0);
      });
      expect(response.statusCode).toEqual(400);
    });
  });

  describe("newAuditFeature disabled", () => {
    test("should create an action audit record", async () => {
      const requestWithValidDataForAudit = httpMocks.createRequest({
        fflip: mockFflipObject({
          newAuditFeature: false
        }),
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: { log: AUDIT_ACTION.LOGGED_IN },
        nickname: currentUser
      });

      const response = httpMocks.createResponse();
      await audit(requestWithValidDataForAudit, response, jest.fn());

      const createdAudits = await models.action_audit.findAll({ raw: true });
      expect(response.statusCode).toEqual(201);
      expect(createdAudits.length).toEqual(1);

      const expectedLog = {
        action: AUDIT_ACTION.LOGGED_IN,
        caseId: null,
        user: currentUser,
        auditType: AUDIT_TYPE.AUTHENTICATION
      };
      expect(createdAudits[0]).toEqual(expect.objectContaining(expectedLog));
    });

    test("should not allow actions that we don't allow", async () => {
      const currentUser = "test username";
      const requestWithValidDataForAudit = httpMocks.createRequest({
        fflip: mockFflipObject({
          newAuditFeature: false
        }),
        method: "POST",
        headers: {
          authorization: "Bearer SOME_MOCK_TOKEN"
        },
        body: { log: "Was Awesome" },
        nickname: currentUser
      });

      const response = httpMocks.createResponse();
      await audit(requestWithValidDataForAudit, response, jest.fn());

      await models.action_audit.count().then(numAudits => {
        expect(numAudits).toEqual(0);
      });
      expect(response.statusCode).toEqual(400);
    });
  });
});
