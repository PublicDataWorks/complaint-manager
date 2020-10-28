import { cleanupDatabase } from "../../testHelpers/requestTestHelpers";
import { AUDIT_ACTION } from "../../../sharedUtilities/constants";

const httpMocks = require("node-mocks-http");
const audit = require("./auditAuthentication");
const models = require("../../policeDataManager/models/index");

describe("Audit", () => {
  const currentUser = "test username";
  let next;

  beforeEach(() => {
    next = jest.fn();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should create an audit record", async () => {
    const requestWithValidDataForAudit = httpMocks.createRequest({
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
      managerType: "complaint",
      referenceId: null,
      user: currentUser
    };
    expect(createdAudits[0]).toEqual(expect.objectContaining(expectedLog));
  });

  test("should create an audit record", async () => {
    const requestWithValidDataForAudit = httpMocks.createRequest({
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
      referenceId: null,
      managerType: "complaint",
      user: currentUser
    };
    expect(createdAudits[0]).toEqual(expect.objectContaining(expectedLog));
  });

  test("should not allow actions that we don't allow", async () => {
    const requestWithValidDataForAudit = httpMocks.createRequest({
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
