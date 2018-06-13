const httpMocks = require("node-mocks-http");
const audit = require("./audit");
const models = require("../../models/index");
import { cleanupDatabase } from "../../requestTestHelpers";

describe("Audit", () => {
  afterEach(async () => {
    await cleanupDatabase();
  });

  test("should create an audit record", async () => {
    const currentUser = "test username";
    const requestWithValidDataForAudit = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { log: "Logged In" },
      nickname: currentUser
    });

    const response = httpMocks.createResponse();
    await audit(requestWithValidDataForAudit, response, jest.fn());

    const createdAudits = await models.audit_log.findAll({ raw: true });
    expect(response.statusCode).toEqual(201);
    expect(createdAudits.length).toEqual(1);

    const expectedLog = {
      action: `Logged In`,
      caseId: null,
      user: currentUser
    };
    expect(createdAudits[0]).toEqual(expect.objectContaining(expectedLog));
  });

  test("should not allow actions that we don't allow", async () => {
    const currentUser = "test username";
    const requestWithValidDataForAudit = httpMocks.createRequest({
      method: "POST",
      headers: {
        authorization: "Bearer SOME_MOCK_TOKEN"
      },
      body: { log: "Was Awesome" },
      nickname: currentUser
    });

    const response = httpMocks.createResponse();
    await audit(requestWithValidDataForAudit, response, jest.fn());

    await models.audit_log.count().then(numAudits => {
      expect(numAudits).toEqual(0);
    });
    expect(response.statusCode).toEqual(400);
  });
});
