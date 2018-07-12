import Case from "../../../../client/testUtilities/case";
import models from "../../../models/index";
const { cleanupDatabase } = require("../../../testHelpers/requestTestHelpers");
const httpMocks = require("node-mocks-http");
const searchOfficers = require("./searchOfficers");
const {
  DATA_ACCESSED,
  AUDIT_TYPE,
  AUDIT_SUBJECT
} = require("../../../../sharedUtilities/constants");

describe("searchOfficers", function() {
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
      query: { firstName: "Sal", caseId: existingCase.id },
      nickname: "nickname"
    });

    const response = httpMocks.createResponse();
    const next = jest.fn();

    await searchOfficers(request, response, next);

    const actionAudit = await models.action_audit.find({
      where: { caseId: existingCase.id },
      returning: true
    });

    expect(actionAudit.user).toEqual("nickname");
    expect(actionAudit.action).toEqual(DATA_ACCESSED);
    expect(actionAudit.subject).toEqual(AUDIT_SUBJECT.OFFICER_DATA);
    expect(actionAudit.auditType).toEqual(AUDIT_TYPE.DATA_ACCESS);
    expect(actionAudit.caseId).toEqual(existingCase.id);
  });
});
